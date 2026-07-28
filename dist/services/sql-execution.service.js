"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlExecutionService = exports.SqlExecutionService = void 0;
const database_config_1 = require("../config/database.config");
const logger_config_1 = require("../config/logger.config");
class SqlExecutionService {
    static MAX_ROWS = 500;
    static QUERY_TIMEOUT_MS = 15000;
    /**
     * Executes a validated SELECT query against PostgreSQL safely with row limits and timeout.
     */
    async executeSelect(sql) {
        logger_config_1.logger.info(`Executing validated SELECT query: ${sql}`);
        const startTime = Date.now();
        const client = await database_config_1.pool.connect();
        try {
            // Set query timeout in session
            await client.query(`SET statement_timeout = ${SqlExecutionService.QUERY_TIMEOUT_MS}`);
            // Limit rows using SQL wrapper if LIMIT isn't already explicit
            const hasLimit = /\bLIMIT\b/i.test(sql);
            const finalSql = hasLimit ? sql : `SELECT * FROM (${sql}) AS query_limited LIMIT ${SqlExecutionService.MAX_ROWS}`;
            const res = await client.query(finalSql);
            const elapsed = Date.now() - startTime;
            logger_config_1.logger.info(`Executed SQL query successfully in ${elapsed}ms (returned ${res.rows.length} rows)`);
            return res.rows;
        }
        catch (e) {
            const elapsed = Date.now() - startTime;
            logger_config_1.logger.error(`SQL query execution failed after ${elapsed}ms: ${e.message}`);
            throw new Error(`Database query execution failed: ${e.message}`);
        }
        finally {
            client.release();
        }
    }
}
exports.SqlExecutionService = SqlExecutionService;
exports.sqlExecutionService = new SqlExecutionService();
