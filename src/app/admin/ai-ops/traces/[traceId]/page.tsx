import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AiTraceInspectorPage({ params }: { params: { traceId: string } }) {
  const trace = await db.aiTrace.findUnique({
    where: { id: params.traceId },
  });

  const events = await db.aiEvent.findMany({
    where: { traceId: params.traceId },
    orderBy: { createdAt: 'asc' },
  });

  if (!trace) {
    return <div className="p-8 text-center text-muted-foreground">Trace not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/ai-ops/traces"
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h2 className="text-2xl font-bold">Trace Inspector</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Execution Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <strong className="text-muted-foreground">Query:</strong>{' '}
              <span className="text-white">{trace.query}</span>
            </div>
            <div>
              <strong className="text-muted-foreground">Response:</strong>{' '}
              <span className="text-white">{trace.response}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />{' '}
              <strong className="text-muted-foreground">Total Latency:</strong> {trace.latency}ms
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Pipeline Stages</h3>
      <div className="space-y-6">
        {events.map((event, index) => (
          <Card
            key={event.id}
            className="bg-background/40 backdrop-blur-xl border-white/10 overflow-hidden"
          >
            <CardHeader className="bg-white/5 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-md flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {index + 1}
                </span>
                {event.stageName}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <Zap className="w-3 h-3 text-amber-400" /> {event.latency}ms
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {event.rcoSnapshot && (
                <div className="max-h-96 overflow-y-auto p-4 bg-black/40">
                  <pre className="text-xs text-emerald-400 font-mono">
                    {JSON.stringify(event.rcoSnapshot, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
            No pipeline events recorded for this trace.
          </div>
        )}
      </div>
    </div>
  );
}
