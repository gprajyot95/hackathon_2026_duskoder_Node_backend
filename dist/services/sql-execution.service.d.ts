export declare class SqlExecutionService {
    private static readonly MAX_ROWS;
    private static readonly QUERY_TIMEOUT_MS;
    /**
     * Executes a validated SELECT query against PostgreSQL safely with row limits and timeout.
     */
    executeSelect(sql: string): Promise<Record<string, any>[]>;
}
export declare const sqlExecutionService: SqlExecutionService;
