import React from 'react';
import { db } from '@/lib/db';
import TraceExplorerClient, { TraceRecord } from './TraceExplorerClient';

export const dynamic = 'force-dynamic';

export default async function AiOpsTracesPage() {
  const rawTraces = await db.aiTrace.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const traces: TraceRecord[] = rawTraces.map((t) => ({
    id: t.id,
    sessionId: t.sessionId,
    query: t.query,
    latency: t.latency,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
  }));

  return <TraceExplorerClient initialTraces={traces} />;
}
