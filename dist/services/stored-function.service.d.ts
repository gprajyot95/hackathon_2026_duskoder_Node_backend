export declare class StoredFunctionService {
    /**
     * Executes a PostgreSQL stored function (e.g. SELECT * FROM get_database_schema())
     * and returns the stringified or raw JSON schema output.
     */
    callStoredFunction(functionName: string): Promise<string | null>;
}
export declare const storedFunctionService: StoredFunctionService;
