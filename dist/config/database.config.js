"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const pg_1 = __importDefault(require("pg"));
const env_config_1 = require("./env.config");
const logger_config_1 = require("./logger.config");
exports.prisma = new client_1.PrismaClient({
    log: env_config_1.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
exports.pool = new pg_1.default.Pool({
    connectionString: env_config_1.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 300000,
    connectionTimeoutMillis: 20000,
});
exports.pool.on('error', (err) => {
    logger_config_1.logger.error('Unexpected PostgreSQL Pool Error: %s', err.message);
});
