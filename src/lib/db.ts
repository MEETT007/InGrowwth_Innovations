import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from './env';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let prismaInstance: PrismaClient;

const logOption = env.LOG_ENABLED ? ['query', 'info', 'warn', 'error'] as any : [];

if (env.isProduction) {
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter, log: logOption });
} else {
  if (!globalForPrisma.prisma) {
    const pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter, log: logOption });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const db = prismaInstance;
