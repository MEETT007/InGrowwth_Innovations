import React from 'react';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, ServerCrash, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AiOpsDashboardPage() {
  // Fetch high level metrics
  const totalSessions = await db.aiSession.count();
  const totalTraces = await db.aiTrace.count();

  const traces = await db.aiTrace.findMany({
    select: { latency: true, status: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const avgLatency =
    traces.length > 0
      ? Math.round(traces.reduce((acc, t) => acc + t.latency, 0) / traces.length)
      : 0;

  const errorRate =
    traces.length > 0
      ? Math.round((traces.filter((t) => t.status === 'FAILED').length / traces.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-background/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total AI Sessions
            </CardTitle>
            <Activity className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Traces
            </CardTitle>
            <Zap className="w-4 h-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTraces}</div>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Avg Latency (last 100)
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgLatency}ms</div>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-xl border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Error Rate (last 100)
            </CardTitle>
            <ServerCrash className="w-4 h-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{errorRate}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
