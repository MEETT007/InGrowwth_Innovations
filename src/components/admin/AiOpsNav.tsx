'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Terminal,
  MessageSquare,
  Database,
  LineChart,
  Brain,
  ShieldCheck,
} from 'lucide-react';

export default function AiOpsNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/ai-ops', icon: Activity, exact: true },
    { name: 'Traces & RCO', href: '/admin/ai-ops/traces', icon: Terminal, exact: false },
    { name: 'Knowledge', href: '/admin/ai-ops/knowledge', icon: Database, exact: false },
    { name: 'Prompts', href: '/admin/ai-ops/prompts', icon: MessageSquare, exact: false },
    { name: 'Evals & Benchmarks', href: '/admin/ai-ops/evals', icon: LineChart, exact: false },
  ];

  return (
    <div className="w-full border-b border-white/10 pb-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Live Status */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                InGrowwth AI Operations
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LangGraph v1.4 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Observability, RCO Context Retrieval, Pipeline Traces &amp; Prompt Governance
            </p>
          </div>
        </div>

        {/* Engine Security & SLA Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-[11px]">Audit Engine: Enforced</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <nav className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold border border-indigo-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
