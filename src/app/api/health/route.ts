import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  let dbStatus = 'DOWN';

  try {
    // Run a simple query to verify database connection
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'UP';
  } catch (error: unknown) {
    console.error('Database health check failed:', error);
  }

  const responseBody = {
    status: dbStatus === 'UP' ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
  };

  const statusCode = dbStatus === 'UP' ? 200 : 503;

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers: { 'Cache-Control': 'no-store' },
  });
}
