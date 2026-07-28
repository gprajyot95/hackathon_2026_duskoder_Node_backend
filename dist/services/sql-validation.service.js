"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlValidationService = exports.SqlValidationService = void 0;
const logger_config_1 = require("../config/logger.config");
class SqlValidationService {
    static DISALLOWED_KEYWORDS = [
        'INSERT', 'UPDATE', 'DELETE', 'MERGE', 'UPSERT', 'ALTER', 'DROP',
        'TRUNCATE', 'CREATE', 'GRANT', 'REVOKE', 'CALL', 'DO', 'EXECUTE',
        'COPY', 'BEGIN', 'COMMIT', 'ROLLBACK', 'RENAME', 'VACUUM', 'INTO'
    ];
    /**
     * Validates that the generated SQL statement is strictly a single read-only SELECT query.
     */
    validate(sql) {
        if (!sql || sql.trim().length === 0) {
            return { isValid: false, errorMessage: 'SQL query string is empty or null.' };
        }
        const cleanedSql = this.sanitize(sql);
        // 1. Check multiple statements
        if (this.containsMultipleStatements(cleanedSql)) {
            logger_config_1.logger.warn('SQL Validation failed: Multiple SQL statements detected');
            return { isValid: false, errorMessage: 'Security Violation: Multiple SQL statements are not permitted.' };
        }
        // 2. Check statement type (Must start with SELECT or WITH)
        const upperSql = cleanedSql.toUpperCase();
        if (!upperSql.startsWith('SELECT') && !upperSql.startsWith('WITH')) {
            logger_config_1.logger.warn('SQL Validation failed: Statement does not start with SELECT or WITH');
            return { isValid: false, errorMessage: 'Security Violation: Only read-only SELECT queries are allowed.' };
        }
        // 3. Reject disallowed keywords (word boundary check)
        for (const keyword of SqlValidationService.DISALLOWED_KEYWORDS) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(cleanedSql)) {
                logger_config_1.logger.warn(`SQL Validation failed: Disallowed keyword '${keyword}' detected in query`);
                return { isValid: false, errorMessage: `Security Violation: Disallowed SQL operation '${keyword}' detected.` };
            }
        }
        logger_config_1.logger.info('SQL Validation succeeded for query');
        return { isValid: true };
    }
    sanitize(sql) {
        let trimmed = sql.trim();
        // Remove block comments /* ... */ and line comments -- ...
        trimmed = trimmed.replace(/\/\*[\s\S]*?\*\//g, '');
        trimmed = trimmed.replace(/--.*$/gm, '');
        return trimmed.trim();
    }
    containsMultipleStatements(sql) {
        const trimmed = sql.endsWith(';') ? sql.slice(0, -1).trim() : sql;
        return trimmed.includes(';');
    }
}
exports.SqlValidationService = SqlValidationService;
exports.sqlValidationService = new SqlValidationService();
