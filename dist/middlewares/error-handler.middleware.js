"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = errorHandlerMiddleware;
const base_error_1 = require("../errors/base.error");
const logger_config_1 = require("../config/logger.config");
function errorHandlerMiddleware(err, req, res, next) {
    const statusCode = err instanceof base_error_1.HttpError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    logger_config_1.logger.error({
        err,
        url: req.originalUrl,
        method: req.method,
        statusCode,
    }, `Unhandled error: ${message}`);
    res.status(statusCode).json({
        status: 'ERROR',
        error: message,
        ...(err instanceof base_error_1.HttpError && err.details ? { details: err.details } : {}),
    });
}
