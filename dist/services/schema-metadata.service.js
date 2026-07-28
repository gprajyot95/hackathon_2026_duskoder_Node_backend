"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaMetadataService = exports.SchemaMetadataService = void 0;
const cache_config_1 = require("../config/cache.config");
const env_config_1 = require("../config/env.config");
const logger_config_1 = require("../config/logger.config");
const stored_function_service_1 = require("./stored-function.service");
class SchemaMetadataService {
    /**
     * Retrieves database schema metadata.
     * On cache miss, loads metadata from PostgreSQL stored function and caches it.
     */
    async getCachedSchemaMetadata() {
        const cachedData = cache_config_1.schemaCache.get(env_config_1.env.CACHE_KEY);
        if (cachedData && cachedData.trim().length > 0) {
            return cachedData;
        }
        logger_config_1.logger.debug(`Cache miss for schema metadata key '${env_config_1.env.CACHE_KEY}'. Loading from PostgreSQL database...`);
        const functionName = env_config_1.env.STORED_FUNCTION_NAME;
        try {
            const jsonOutput = await stored_function_service_1.storedFunctionService.callStoredFunction(functionName);
            if (jsonOutput && jsonOutput.trim().length > 0) {
                cache_config_1.schemaCache.set(env_config_1.env.CACHE_KEY, jsonOutput);
                logger_config_1.logger.info(`Successfully fetched schema metadata from PostgreSQL stored function '${functionName}' and cached.`);
                return jsonOutput;
            }
            else {
                logger_config_1.logger.warn(`Received empty schema payload from stored function '${functionName}'`);
                return null;
            }
        }
        catch (e) {
            logger_config_1.logger.error(`Failed to load schema metadata from PostgreSQL database: ${e.message}`);
            return null;
        }
    }
    /**
     * Refreshes schema metadata from PostgreSQL stored function and updates cache.
     */
    async refreshSchemaMetadata() {
        const functionName = env_config_1.env.STORED_FUNCTION_NAME;
        logger_config_1.logger.info(`Schema refresh initiated. Executing PostgreSQL function '${functionName}'...`);
        try {
            const jsonOutput = await stored_function_service_1.storedFunctionService.callStoredFunction(functionName);
            if (jsonOutput && jsonOutput.trim().length > 0) {
                cache_config_1.schemaCache.set(env_config_1.env.CACHE_KEY, jsonOutput);
                logger_config_1.logger.info(`Schema refresh successful. Updated cache key '${env_config_1.env.CACHE_KEY}'`);
                return true;
            }
            else {
                logger_config_1.logger.warn(`Schema refresh failed: empty payload from stored function '${functionName}'`);
                return false;
            }
        }
        catch (e) {
            logger_config_1.logger.error(`Failed to refresh schema metadata in PostgreSQL: ${e.message}`);
            return false;
        }
    }
    /**
     * Evicts schema metadata entry from cache.
     */
    evictSchemaMetadataCache() {
        cache_config_1.schemaCache.del(env_config_1.env.CACHE_KEY);
        logger_config_1.logger.info(`Evicted schema metadata from cache key '${env_config_1.env.CACHE_KEY}'`);
    }
    /**
     * Checks whether schema metadata currently exists in cache.
     */
    isCachePresent() {
        const data = cache_config_1.schemaCache.get(env_config_1.env.CACHE_KEY);
        return Boolean(data && data.trim().length > 0);
    }
}
exports.SchemaMetadataService = SchemaMetadataService;
exports.schemaMetadataService = new SchemaMetadataService();
