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

// Native Body Parsing Middleware (Replaces body-parser/iconv-lite to prevent Cloudflare Worker V8 bundling errors)
app.use((req: any, _res: any, next: any) => {
  if (req.body !== undefined && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return next();
  }
  const contentType = (req.headers['content-type'] || '').toLowerCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        if (contentType.includes('application/json')) {
          req.body = raw ? JSON.parse(raw) : {};
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          req.body = Object.fromEntries(new URLSearchParams(raw));
        } else {
          req.body = raw || {};
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
  } else {
    req.body = req.body || {};
    next();
  }
});

// Request Logging Middleware
app.use(requestLoggerMiddleware);

// Swagger Documentation UI (Gracefully handled if file unavailable in worker runtime)
try {
  const swaggerPath = path.resolve(__dirname, '../swagger.yaml');
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e: any) {
  console.warn(`Could not load swagger.yaml: ${e.message}`);
}

// Master API Routes
app.use(masterRouter);

// Centralized Error Handling Middleware
app.use(errorHandlerMiddleware);

export default app;
