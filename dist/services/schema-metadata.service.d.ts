export declare class SchemaMetadataService {
    /**
     * Retrieves database schema metadata.
     * On cache miss, loads metadata from PostgreSQL stored function and caches it.
     */
    getCachedSchemaMetadata(): Promise<string | null>;
    /**
     * Refreshes schema metadata from PostgreSQL stored function and updates cache.
     */
    refreshSchemaMetadata(): Promise<boolean>;
    /**
     * Evicts schema metadata entry from cache.
     */
    evictSchemaMetadataCache(): void;
    /**
     * Checks whether schema metadata currently exists in cache.
     */
    isCachePresent(): boolean;
}
export declare const schemaMetadataService: SchemaMetadataService;
