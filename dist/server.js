if (typeof globalThis.__dirname === 'undefined') {
    globalThis.__dirname = '/';
}
if (typeof globalThis.__filename === 'undefined') {
    globalThis.__filename = '/server.js';
}
if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
}
import { EventEmitter } from 'events';
import app from './app';
import { env } from './config/env.config';
import { logger } from './config/logger.config';
import { schemaMetadataService } from './services/schema-metadata.service';
import { postgresListenerService } from './services/postgres-listener.service';
import { userRepository } from './repositories/user.repository';
let isInitialized = false;
async function bootstrapWorker() {
    if (isInitialized)
        return;
    isInitialized = true;
    try {
        logger.info('========================================================================');
        logger.info('Initializing Production-Grade Cloudflare Worker Node.js Backend...');
        logger.info('========================================================================');
        try {
            await userRepository.ensureAdminUserExists();
        }
        catch (e) {
            logger.warn(`Could not ensure admin user exists: ${e.message}`);
        }
        if (env.FETCH_ON_STARTUP) {
            const success = await schemaMetadataService.refreshSchemaMetadata();
            if (success) {
                logger.info('STARTUP TASK COMPLETED: Initial database schema loaded into cache.');
            }
        }
        await postgresListenerService.start();
    }
    catch (error) {
        logger.error(`Worker startup initialization warning: ${error.message}`);
    }
}
/**
 * Cloudflare Worker ES Module Fetch Export
 */
export default {
    async fetch(request, _env, _ctx) {
        await bootstrapWorker();
        return new Promise((resolve) => {
            const url = new URL(request.url);
            const reqStream = new EventEmitter();
            reqStream.method = request.method;
            reqStream.url = url.pathname + url.search;
            reqStream.headers = {};
            request.headers.forEach((value, key) => {
                reqStream.headers[key] = value;
            });
            const resHeaders = new Headers();
            let statusCode = 200;
            const chunks = [];
            const resStream = new EventEmitter();
            resStream.statusCode = 200;
            resStream.setHeader = (name, value) => {
                resHeaders.set(name, String(value));
            };
            resStream.getHeader = (name) => resHeaders.get(name);
            resStream.removeHeader = (name) => resHeaders.delete(name);
            resStream.writeHead = (code, headers) => {
                statusCode = code;
                if (headers) {
                    Object.entries(headers).forEach(([k, v]) => resHeaders.set(k, String(v)));
                }
            };
            resStream.write = (chunk) => {
                if (chunk) {
                    chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
                }
                return true;
            };
            resStream.end = (chunk) => {
                if (chunk) {
                    chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
                }
                const bodyLength = chunks.reduce((acc, c) => acc + c.length, 0);
                const combined = new Uint8Array(bodyLength);
                let offset = 0;
                for (const c of chunks) {
                    combined.set(c, offset);
                    offset += c.length;
                }
                resolve(new Response(combined, {
                    status: statusCode,
                    headers: resHeaders,
                }));
            };
            // Dispatch to Express application handler
            app(reqStream, resStream);
            // Handle Request body stream
            if (request.body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
                request
                    .arrayBuffer()
                    .then((buf) => {
                    reqStream.emit('data', Buffer.from(buf));
                    reqStream.emit('end');
                })
                    .catch((err) => {
                    reqStream.emit('error', err);
                });
            }
            else {
                reqStream.emit('end');
            }
        });
    },
};
// Standalone execution for local development
if (process.env.NODE_ENV !== 'production' && process.env.CLOUDFLARE_WORKER !== 'true') {
    bootstrapWorker().then(() => {
        app.listen(env.PORT, () => {
            logger.info(`🚀 Local Node server running on http://localhost:${env.PORT}`);
        });
    });
}
