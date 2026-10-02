import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle2,
  Layers,
  Terminal,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import CodeBlock from '@/components/chat/CodeBlock';

export const dynamic = 'force-dynamic';

export default async function AiTraceInspectorPage({
  params,
}: {
  params: Promise<{ traceId: string }>;
}) {
  const { traceId } = await params;

  const trace = await db.aiTrace.findUnique({
    where: { id: traceId },
  });

  const events = await db.aiEvent.findMany({
    where: { traceId },
    orderBy: { createdAt: 'asc' },
  });

  if (!trace) {
    return (
      <div className="p-12 text-center text-slate-400 bg-[#0e121d] rounded-3xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-2">Trace Not Located</h3>
        <p className="text-xs mb-4">The requested trace record does not exist or has been purged.</p>
        <Link
          href="/admin/ai-ops/traces"
          className="text-xs text-indigo-400 hover:underline"
        >
          ← Return to Trace Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/ai-ops/traces"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Back to Traces"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Trace Inspector</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {trace.id}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Session: <span className="font-mono text-slate-300">{trace.sessionId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              trace.status === 'SUCCESS'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {trace.status}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-amber-400 border border-white/10">
            <Clock className="w-3 h-3" />
            {trace.latency}ms total
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Prompt Input */}
        <div className="rounded-3xl p-6 bg-[#0e121d] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
            <span className="font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Incoming User Query
            </span>
            <span className="font-mono text-[11px]">
              {new Date(trace.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {trace.query}
          </div>
        </div>

        {/* Synthesized Response */}
        <div className="rounded-3xl p-6 bg-[#0e121d] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
            <span className="font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Agent Output Payload
            </span>
            <span className="font-mono text-[11px] text-emerald-400">Validated</span>
          </div>
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed max-h-48 overflow-y-auto scrollbar-thin">
            {trace.response || 'No response text stored.'}
          </div>
        </div>
      </div>

      {/* Pipeline Stage Timeline */}
      <div className="rounded-3xl p-6 bg-[#0e121d] border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              LangGraph Execution Stages ({events.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            RCO (Retrieval Context Object) Snapshots
          </span>
        </div>

        <div className="space-y-4">
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {event.stageName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Zap className="w-3 h-3" />
                    {event.latency}ms
                  </span>
                </div>
              </div>

              {event.rcoSnapshot ? (
                <div className="p-4">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Stage State Snapshot (RCO):</span>
                  </div>
                  <CodeBlock
                    language="json"
                    value={JSON.stringify(event.rcoSnapshot, null, 2)}
                  />
                </div>
              ) : (
                <div className="p-3 text-[11px] text-slate-500 italic px-5">
                  No state mutation snapshot recorded for this stage.
                </div>
              )}
            </div>
          ))}

          {events.length === 0 && (
            <div className="p-10 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
              No individual stage events captured for this trace execution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
