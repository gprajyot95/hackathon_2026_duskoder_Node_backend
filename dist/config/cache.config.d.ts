import NodeCache from 'node-cache';
/**
 * NodeCache singleton representing in-memory cache.
 * checkperiod: 0 prevents top-level setInterval timers in Cloudflare Workers global scope.
 */
export declare const schemaCache: NodeCache;
