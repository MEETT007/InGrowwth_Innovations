'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Terminal,
  Clock,
  CheckCircle2,
  ShieldAlert,
  Copy,
  Check,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface TraceRecord {
  id: string;
  sessionId: string;
  query: string;
  latency: number;
  status: string;
  createdAt: string;
}

export default function TraceExplorerClient({ initialTraces }: { initialTraces: TraceRecord[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = initialTraces.filter((t) => {
    const matchesSearch =
      t.query.toLowerCase().includes(search.toLowerCase()) ||
      t.sessionId.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Search and Filters Header */}
      <div className="p-6 rounded-3xl bg-[#0e121d] border border-white/10 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by query content, Session ID, or Trace ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto">
          <span className="text-slate-500 px-2 py-1 text-xs flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Status:</span>
          </span>
          {(['ALL', 'SUCCESS', 'FAILED'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trace Table */}
      <div className="rounded-3xl bg-[#0e121d] border border-white/10 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Execution Traces ({filtered.length})</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Real-time LangGraph Traces
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-5 py-3.5">Trace ID</th>
                <th className="px-5 py-3.5">Session</th>
                <th className="px-5 py-3.5">User Prompt</th>
                <th className="px-5 py-3.5">Latency</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((trace) => (
                <tr key={trace.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4 font-mono text-slate-400">
                    <button
                      type="button"
                      onClick={(e) => handleCopyId(trace.id, e)}
                      className="flex items-center gap-1.5 hover:text-white text-slate-400 transition-colors cursor-pointer"
                      title="Copy full trace ID"
                    >
                      <span>{trace.id.substring(0, 8)}...</span>
                      {copiedId === trace.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </td>

                  <td className="px-5 py-4 font-mono text-slate-400 text-[11px]">
                    {trace.sessionId.substring(0, 10)}...
                  </td>

                  <td className="px-5 py-4 text-white max-w-[280px] sm:max-w-[340px] truncate font-medium">
                    {trace.query}
                  </td>

                  <td className="px-5 py-4 font-mono">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        trace.latency < 500
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : trace.latency < 1500
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {trace.latency}ms
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        trace.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {trace.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <ShieldAlert className="w-3 h-3" />
                      )}
                      {trace.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                    {formatDistanceToNow(new Date(trace.createdAt), { addSuffix: true })}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/ai-ops/traces/${trace.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] border border-indigo-500/20 transition-all"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    No traces matched your filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
