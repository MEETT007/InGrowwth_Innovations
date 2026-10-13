import { PrismaClient, Prisma } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from './env';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const logOption: Prisma.LogLevel[] = env.LOG_ENABLED ? ['info', 'warn', 'error'] : [];

function createClient() {
  // Warm function instances reuse the pool. A new request reconnects after idle expiry.
  const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });
  pool.on('error', () => {
    logger.error('An idle database connection closed; the pool will reconnect on demand.');
  });
  return new PrismaClient({ adapter: new PrismaPg(pool), log: logOption });
}

export const db = globalForPrisma.prisma ?? createClient();
globalForPrisma.prisma = db;
