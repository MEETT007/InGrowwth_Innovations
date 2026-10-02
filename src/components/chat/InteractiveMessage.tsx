'use client';

import React from 'react';
import { Clock, Code2, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function TimelineCard({ min, max }: { min: number; max: number }) {
  const percentage = Math.min(Math.max((max / 24) * 100, 15), 100);

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black/40 p-4 sm:p-5 shadow-lg shadow-indigo-950/30 mt-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Clock className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Estimated Engineering Timeline
          </h4>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {min} – {max} Weeks
        </span>
      </div>

      <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Sprint 0 (Design &amp; Discovery)</span>
        <span className="text-indigo-300 font-medium">Production MVP Target</span>
      </div>
    </div>
  );
}

export function TechStackCard({ stack }: { stack: string[] }) {
  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-black/40 p-4 sm:p-5 shadow-lg shadow-cyan-950/20 mt-3">
      <div className="flex items-center gap-2 text-cyan-400 mb-3">
        <Code2 className="w-4 h-4" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
          Recommended Architecture Stack
        </h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {stack.map((tech, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl text-xs font-semibold text-cyan-200 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MissingReqsCard({ reqs }: { reqs: string[] }) {
  if (!reqs || reqs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-black/40 p-4 sm:p-5 shadow-lg shadow-amber-950/20 mt-3 relative overflow-hidden">
      <div className="flex items-center gap-2 text-amber-400 mb-3">
        <AlertTriangle className="w-4 h-4" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
          Critical Gaps &amp; Clarification Points ({reqs.length})
        </h4>
      </div>

      <ul className="space-y-2 relative z-10">
        {reqs.map((req, i) => (
          <li key={i} className="flex items-start text-xs sm:text-sm text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-2.5 shrink-0" />
            <span className="leading-relaxed">{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import MeetingBooking from './MeetingBooking';

export interface InteractiveData {
  type?: string;
  missingRequirements?: string[];
  techStack?: string[];
  timeline?: { min: number; max: number };
  architecturePattern?: string;
  adrs?: Array<{ title: string; status: string; decision: string }>;
  [key: string]: unknown;
}

export default function InteractiveMessage({ data }: { data: InteractiveData }) {
  if (data.type === 'CALENDAR_BOOKING') {
    return <MeetingBooking />;
  }

  if (data.type === 'REQUIREMENT_ANALYSIS' || data.type === 'ARCHITECTURE_SYNTHESIS') {

    return (
      <div className="space-y-3 mt-4 w-full">
        {data.missingRequirements && data.missingRequirements.length > 0 && (
          <MissingReqsCard reqs={data.missingRequirements} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.techStack && data.techStack.length > 0 && (
            <TechStackCard stack={data.techStack} />
          )}
          {data.timeline && (
            <TimelineCard min={data.timeline.min} max={data.timeline.max} />
          )}
        </div>

        {data.architecturePattern && (
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 flex items-center gap-3">
            <Layers className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold block">
                Target Pattern
              </span>
              <span className="text-sm font-semibold text-white">
                {data.architecturePattern}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
