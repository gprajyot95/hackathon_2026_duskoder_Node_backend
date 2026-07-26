import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080').transform(val => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL: z.string().default('gemini-3.6-flash'),
  STORED_FUNCTION_NAME: z.string().default('get_database_schema'),
  CACHE_NAME: z.string().default('schemaMetadata'),
  CACHE_KEY: z.string().default('databaseSchema'),
  CACHE_TTL_HOURS: z.string().default('6').transform(val => parseInt(val, 10)),
  FETCH_ON_STARTUP: z.string().default('true').transform(val => val.toLowerCase() === 'true'),
  NOTIFICATION_ENABLED: z.string().default('true').transform(val => val.toLowerCase() === 'true'),
  NOTIFICATION_CHANNEL: z.string().default('schema_changed'),
  NOTIFICATION_DEBOUNCE_MS: z.string().default('1000').transform(val => parseInt(val, 10)),
  NOTIFICATION_RECONNECT_MS: z.string().default('5000').transform(val => parseInt(val, 10)),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
