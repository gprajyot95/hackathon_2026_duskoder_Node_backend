"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaCache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const env_config_1 = require("./env.config");
/**
 * NodeCache singleton representing in-memory cache.
 * checkperiod: 0 prevents top-level setInterval timers in Cloudflare Workers global scope.
 */
exports.schemaCache = new node_cache_1.default({
    stdTTL: env_config_1.env.CACHE_TTL_HOURS * 3600,
    checkperiod: 0,
    useClones: false,
});
