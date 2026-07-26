"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('8080').transform(val => parseInt(val, 10)),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().url(),
    GEMINI_API_KEY: zod_1.z.string().min(1, 'GEMINI_API_KEY is required'),
    GEMINI_MODEL: zod_1.z.string().default('gemini-3.6-flash'),
    STORED_FUNCTION_NAME: zod_1.z.string().default('get_database_schema'),
    CACHE_NAME: zod_1.z.string().default('schemaMetadata'),
    CACHE_KEY: zod_1.z.string().default('databaseSchema'),
    CACHE_TTL_HOURS: zod_1.z.string().default('6').transform(val => parseInt(val, 10)),
    FETCH_ON_STARTUP: zod_1.z.string().default('true').transform(val => val.toLowerCase() === 'true'),
    NOTIFICATION_ENABLED: zod_1.z.string().default('true').transform(val => val.toLowerCase() === 'true'),
    NOTIFICATION_CHANNEL: zod_1.z.string().default('schema_changed'),
    NOTIFICATION_DEBOUNCE_MS: zod_1.z.string().default('1000').transform(val => parseInt(val, 10)),
    NOTIFICATION_RECONNECT_MS: zod_1.z.string().default('5000').transform(val => parseInt(val, 10)),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
