import { logger } from '../config/logger.config';
export function requestLoggerMiddleware(req, res, next) {
    const startTime = Date.now();
    res.on('finish', () => {
        const elapsed = Date.now() - startTime;
        logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: elapsed,
        }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
    });
    next();
}
