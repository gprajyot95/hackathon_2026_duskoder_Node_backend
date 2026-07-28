import { HttpError } from '../errors/base.error';
import { logger } from '../config/logger.config';
export function errorHandlerMiddleware(err, req, res, next) {
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    logger.error({
        err,
        url: req.originalUrl,
        method: req.method,
        statusCode,
    }, `Unhandled error: ${message}`);
    res.status(statusCode).json({
        status: 'ERROR',
        error: message,
        ...(err instanceof HttpError && err.details ? { details: err.details } : {}),
    });
}
