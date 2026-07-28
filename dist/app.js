import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import masterRouter from './routes/index';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';
const app = express();
// Security Middlewares
app.use(helmet());
app.use(cors());
// Zero-dependency native body parsing middleware
app.use((req, _res, next) => {
    // Skip if body already exists
    if (req.body !== undefined) {
        return next();
    }
    const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!methods.includes(req.method)) {
        req.body = {};
        return next();
    }
    const chunks = [];
    req.on('data', (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        try {
            const raw = Buffer.concat(chunks).toString('utf-8');
            const contentType = (req.headers['content-type'] || '').toLowerCase();
            if (contentType.includes('application/json')) {
                req.body = raw ? JSON.parse(raw) : {};
            }
            else if (contentType.includes('application/x-www-form-urlencoded')) {
                req.body = Object.fromEntries(new URLSearchParams(raw));
            }
            else {
                req.body = raw;
            }
        }
        catch {
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
// Swagger Documentation UI (Gracefully handled if file unavailable in worker runtime)
try {
    const swaggerPath = path.resolve(__dirname, '../swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
catch (e) {
    console.warn(`Could not load swagger.yaml: ${e.message}`);
}
// Master API Routes
app.use(masterRouter);
// Centralized Error Handling Middleware
app.use(errorHandlerMiddleware);
export default app;
