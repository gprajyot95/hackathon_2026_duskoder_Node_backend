"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = requestLoggerMiddleware;
const logger_config_1 = require("../config/logger.config");
function requestLoggerMiddleware(req, res, next) {
    const startTime = Date.now();
    res.on('finish', () => {
        const elapsed = Date.now() - startTime;
        logger_config_1.logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            durationMs: elapsed,
        }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms`);
    });
    next();
}
