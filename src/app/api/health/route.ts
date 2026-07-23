import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  let dbStatus = 'DOWN';
  let dbError = null;

  try {
    // Run a simple query to verify database connection
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'UP';
  } catch (error: unknown) {
    console.error('Database health check failed:', error);
    dbError = error instanceof Error ? error.message : 'Unknown database error';
  }

  const appVersion = '0.1.0'; // Application version from package.json

  const responseBody = {
    status: dbStatus === 'UP' ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    version: appVersion,
    environment: process.env.NODE_ENV,
    checks: {
      database: {
        status: dbStatus,
        ...(dbError && { error: dbError }),
      },
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'LOADED' : 'MISSING',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ? 'LOADED' : 'MISSING',
      },
    },
  };

  const statusCode = dbStatus === 'UP' ? 200 : 503;

  return NextResponse.json(responseBody, { status: statusCode });
}
