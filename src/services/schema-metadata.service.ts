import { schemaCache } from '../config/cache.config';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { storedFunctionService } from './stored-function.service';

export class SchemaMetadataService {
  /**
   * Retrieves database schema metadata.
   * On cache miss, loads metadata from PostgreSQL stored function and caches it.
   */
  public async getCachedSchemaMetadata(): Promise<string | null> {
    const cachedData = schemaCache.get<string>(env.CACHE_KEY);
    if (cachedData && cachedData.trim().length > 0) {
      return cachedData;
    }

    logger.debug(`Cache miss for schema metadata key '${env.CACHE_KEY}'. Loading from PostgreSQL database...`);
    const functionName = env.STORED_FUNCTION_NAME;

    try {
      const jsonOutput = await storedFunctionService.callStoredFunction(functionName);
      if (jsonOutput && jsonOutput.trim().length > 0) {
        schemaCache.set(env.CACHE_KEY, jsonOutput);
        logger.info(`Successfully fetched schema metadata from PostgreSQL stored function '${functionName}' and cached.`);
        return jsonOutput;
      } else {
        logger.warn(`Received empty schema payload from stored function '${functionName}'`);
        return null;
      }
    } catch (e: any) {
      logger.error(`Failed to load schema metadata from PostgreSQL database: ${e.message}`);
      return null;
    }
  }

  /**
   * Refreshes schema metadata from PostgreSQL stored function and updates cache.
   */
  public async refreshSchemaMetadata(): Promise<boolean> {
    const functionName = env.STORED_FUNCTION_NAME;
    logger.info(`Schema refresh initiated. Executing PostgreSQL function '${functionName}'...`);
    try {
      const jsonOutput = await storedFunctionService.callStoredFunction(functionName);
      if (jsonOutput && jsonOutput.trim().length > 0) {
        schemaCache.set(env.CACHE_KEY, jsonOutput);
        logger.info(`Schema refresh successful. Updated cache key '${env.CACHE_KEY}'`);
        return true;
      } else {
        logger.warn(`Schema refresh failed: empty payload from stored function '${functionName}'`);
        return false;
      }
    } catch (e: any) {
      logger.error(`Failed to refresh schema metadata in PostgreSQL: ${e.message}`);
      return false;
    }
  }

  /**
   * Evicts schema metadata entry from cache.
   */
  public evictSchemaMetadataCache(): void {
    schemaCache.del(env.CACHE_KEY);
    logger.info(`Evicted schema metadata from cache key '${env.CACHE_KEY}'`);
  }

  /**
   * Checks whether schema metadata currently exists in cache.
   */
  public isCachePresent(): boolean {
    const data = schemaCache.get<string>(env.CACHE_KEY);
    return Boolean(data && data.trim().length > 0);
  }
}

export const schemaMetadataService = new SchemaMetadataService();
