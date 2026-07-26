export interface ValidationResult {
    isValid: boolean;
    errorMessage?: string;
}
export declare class SqlValidationService {
    private static readonly DISALLOWED_KEYWORDS;
    /**
     * Validates that the generated SQL statement is strictly a single read-only SELECT query.
     */
    validate(sql: string | null | undefined): ValidationResult;
    private sanitize;
    private containsMultipleStatements;
}
export declare const sqlValidationService: SqlValidationService;
