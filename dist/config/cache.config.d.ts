import NodeCache from 'node-cache';
/**
 * NodeCache singleton representing Caffeine in-memory cache.
 * Default stdTTL: 6 hours (matching CACHE_TTL_HOURS in Spring Boot).
 */
export declare const schemaCache: NodeCache;
