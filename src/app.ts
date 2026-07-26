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

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use(requestLoggerMiddleware);

// Swagger Documentation UI
try {
  const swaggerDocument = YAML.load(path.resolve(__dirname, '../swagger.yaml'));
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
