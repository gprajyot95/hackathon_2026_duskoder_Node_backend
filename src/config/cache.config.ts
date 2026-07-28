import NodeCache from 'node-cache';
import { env } from './env.config';

/**
 * NodeCache singleton representing in-memory cache.
 * checkperiod: 0 prevents top-level setInterval timers in Cloudflare Workers global scope.
 */
export const schemaCache = new NodeCache({
  stdTTL: env.CACHE_TTL_HOURS * 3600,
  checkperiod: 0,
  useClones: false,
});
