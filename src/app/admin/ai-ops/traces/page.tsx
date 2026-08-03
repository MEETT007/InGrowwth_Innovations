import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function AiOpsTracesPage() {
  const traces = await db.aiTrace.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <Card className="bg-background/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-xl">AI Traces (Recent 50)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white/5">
              <tr>
                <th className="px-4 py-3 rounded-tl-xl">Session ID</th>
                <th className="px-4 py-3">Query</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3 rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {traces.map((trace) => (
                <tr
                  key={trace.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {trace.sessionId.substring(0, 12)}...
                  </td>
                  <td className="px-4 py-3 truncate max-w-[200px]">{trace.query}</td>
                  <td className="px-4 py-3">{trace.latency}ms</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={trace.status === 'SUCCESS' ? 'default' : 'destructive'}
                      className={
                        trace.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : ''
                      }
                    >
                      {trace.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {formatDistanceToNow(new Date(trace.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/ai-ops/traces/${trace.id}`}
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
