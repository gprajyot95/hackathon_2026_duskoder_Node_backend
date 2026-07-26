import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { env } from './env.config';
import { logger } from './logger.config';

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 20000,
});

pool.on('error', (err) => {
  logger.error('Unexpected PostgreSQL Pool Error: %s', err.message);
});
