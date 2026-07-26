import { PrismaClient } from '@prisma/client';
import pg from 'pg';
export declare const prisma: PrismaClient<{
    log: ("info" | "error" | "warn" | "query")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const pool: pg.Pool;
