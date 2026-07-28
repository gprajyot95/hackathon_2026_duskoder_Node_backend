if (typeof (globalThis as any).__dirname === 'undefined') {
  (globalThis as any).__dirname = '/';
}
if (typeof (globalThis as any).__filename === 'undefined') {
  (globalThis as any).__filename = '/server.js';
}
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import masterRouter from './routes/index';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Zero-dependency native body parsing middleware
app.use((req: any, _res: any, next: any) => {
  // Skip if body already exists
  if (req.body !== undefined) {
    return next();
  }

  const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!methods.includes(req.method)) {
    req.body = {};
    return next();
  }

  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    try {
      const raw = Buffer.concat(chunks).toString('utf-8');

      const contentType =
        (req.headers['content-type'] || '').toLowerCase();

      if (contentType.includes('application/json')) {
        req.body = raw ? JSON.parse(raw) : {};
      } else if (
        contentType.includes(
          'application/x-www-form-urlencoded'
        )
      ) {
        req.body = Object.fromEntries(
          new URLSearchParams(raw)
        );
      } else {
        req.body = raw;
      }
    } catch {
      req.body = {};
    }

    next();
  });

  req.on('error', () => {
    req.body = {};
    next();
  });
});

// Request Logging Middleware
app.use(requestLoggerMiddleware);

// Swagger Documentation UI (Lazy loaded with safety fallback for Cloudflare Workers)
(async () => {
  try {
    const swaggerUi = (await import('swagger-ui-express')).default;
    const YAML = (await import('yamljs')).default;
    const swaggerPath = path.resolve((globalThis as any).__dirname || '/', '../swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (e: any) {
    console.warn(`Swagger UI initialization skipped in worker: ${e.message}`);
  }
})();

// Master API Routes
app.use(masterRouter);

// Centralized Error Handling Middleware
app.use(errorHandlerMiddleware);

export default app;
