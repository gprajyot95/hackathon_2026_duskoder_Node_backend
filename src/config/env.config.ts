import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080').transform(val => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/mockdb?schema=public'),
  GEMINI_API_KEY: z.string().default('mock-gemini-api-key'),
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

export const env = _env.success ? _env.data : {
  PORT: 8080,
  NODE_ENV: 'development' as const,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/mockdb?schema=public',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'mock-gemini-api-key',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  STORED_FUNCTION_NAME: process.env.STORED_FUNCTION_NAME || 'get_database_schema',
  CACHE_NAME: process.env.CACHE_NAME || 'schemaMetadata',
  CACHE_KEY: process.env.CACHE_KEY || 'databaseSchema',
  CACHE_TTL_HOURS: 6,
  FETCH_ON_STARTUP: (process.env.FETCH_ON_STARTUP || 'true').toLowerCase() === 'true',
  NOTIFICATION_ENABLED: (process.env.NOTIFICATION_ENABLED || 'true').toLowerCase() === 'true',
  NOTIFICATION_CHANNEL: process.env.NOTIFICATION_CHANNEL || 'schema_changed',
  NOTIFICATION_DEBOUNCE_MS: 1000,
  NOTIFICATION_RECONNECT_MS: 5000,
};
