import NodeCache from 'node-cache';
import { env } from './env.config';

/**
 * NodeCache singleton representing Caffeine in-memory cache.
 * Default stdTTL: 6 hours (matching CACHE_TTL_HOURS in Spring Boot).
 */
export const schemaCache = new NodeCache({
  stdTTL: env.CACHE_TTL_HOURS * 3600,
  checkperiod: 600,
  useClones: false,
});
