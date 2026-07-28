import { pool } from '../config/database.config';
import { logger } from '../config/logger.config';
export class StoredFunctionService {
    /**
     * Executes a PostgreSQL stored function (e.g. SELECT * FROM get_database_schema())
     * and returns the stringified or raw JSON schema output.
     */
    async callStoredFunction(functionName) {
        logger.info(`Executing PostgreSQL stored function: SELECT * FROM ${functionName}()`);
        const sqlSelectAll = `SELECT * FROM ${functionName}()`;
        try {
            const result = await pool.query(sqlSelectAll);
            if (result && result.rows && result.rows.length > 0) {
                if (result.rows.length === 1 && Object.keys(result.rows[0]).length === 1) {
                    const firstVal = Object.values(result.rows[0])[0];
                    if (typeof firstVal === 'string') {
                        return firstVal;
                    }
                    return JSON.stringify(firstVal);
                }
                return JSON.stringify(result.rows);
            }
        }
        catch (e) {
            logger.info(`Direct query 'SELECT * FROM ${functionName}()' failed (${e.message}). Attempting 'SELECT ${functionName}()'...`);
        }
        try {
            const sqlSelectFunc = `SELECT ${functionName}()`;
            const result = await pool.query(sqlSelectFunc);
            if (result && result.rows && result.rows.length > 0) {
                const firstVal = Object.values(result.rows[0])[0];
                return typeof firstVal === 'string' ? firstVal : JSON.stringify(firstVal);
            }
        }
        catch (ex) {
            logger.error(`Error executing PostgreSQL function '${functionName}': ${ex.message}`);
            throw new Error(`Failed to call PostgreSQL stored function: ${functionName}`);
        }
        return null;
    }
}
export const storedFunctionService = new StoredFunctionService();
