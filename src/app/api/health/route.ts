import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function GET() {
  let dbStatus = 'DOWN';
  let schemaStatus = 'DOWN';

  try {
    // Run a simple query to verify database connection
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'UP';
    // A reachable database without the application's current schema is not ready.
    await db.service.findFirst({
      select: { id: true, slug: true, content: true, isExpertise: true },
    });
    await db.aiSession.count();
    schemaStatus = 'UP';
  } catch (error: unknown) {
    logger.error('Database health check failed:', error);
  }

  const responseBody = {
    status: dbStatus === 'UP' && schemaStatus === 'UP' ? 'UP' : 'DEGRADED',
    checks: { database: dbStatus, schema: schemaStatus },
    timestamp: new Date().toISOString(),
  };

  const statusCode = dbStatus === 'UP' && schemaStatus === 'UP' ? 200 : 503;

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers: { 'Cache-Control': 'no-store' },
  });
}
