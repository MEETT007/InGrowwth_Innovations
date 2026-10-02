'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock,
  Terminal,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

export interface ThinkingStep {
  label: string;
  duration?: string;
  completed?: boolean;
}

interface ThinkingProcessProps {
  steps?: ThinkingStep[];
  reasoningTrace?: string;
  durationMs?: number;
  initialExpanded?: boolean;
}

export default function ThinkingProcess({
  steps = [
    { label: 'Deconstructing problem domain & architectural constraints', duration: '140ms', completed: true },
    { label: 'Querying InGrowwth verified Enterprise ADR Knowledge Base', duration: '320ms', completed: true },
    { label: 'Evaluating high-throughput scalability, latency SLAs & security vectors', duration: '380ms', completed: true },
    { label: 'Synthesizing actionable executive recommendations & architecture blueprint', duration: '260ms', completed: true },
  ],
  reasoningTrace,
  durationMs = 1200,
  initialExpanded = false,
}: ThinkingProcessProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [activeTab, setActiveTab] = useState<'steps' | 'trace'>(reasoningTrace ? 'steps' : 'steps');
  const [copiedTrace, setCopiedTrace] = useState(false);

  const handleCopyTrace = () => {
    if (!reasoningTrace) return;
    navigator.clipboard.writeText(reasoningTrace);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div className="w-full my-3 rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/20 via-purple-950/10 to-black/30 backdrop-blur-md overflow-hidden transition-all shadow-md shadow-indigo-950/10">
      {/* Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-500/5 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="font-semibold tracking-wide text-indigo-200">
            Architectural Reasoning Process
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Clock className="w-2.5 h-2.5" />
            {(durationMs / 1000).toFixed(1)}s
          </span>
          {reasoningTrace && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-purple-400/90 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Terminal className="w-2.5 h-2.5" />
              Chain-of-Thought Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
          <span>{isExpanded ? 'Hide reasoning' : 'Show reasoning'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-indigo-500/15 bg-black/30 text-xs"
          >
            {/* Sub-Tabs if trace is available */}
            {reasoningTrace && (
              <div className="flex items-center justify-between px-4 pt-2.5 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('steps')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      activeTab === 'steps'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Decision Milestones ({steps.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('trace')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      activeTab === 'trace'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Deep Analytical Trace</span>
                  </button>
                </div>

                {activeTab === 'trace' && (
                  <button
                    type="button"
                    onClick={handleCopyTrace}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white cursor-pointer font-mono"
                  >
                    {copiedTrace ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTrace ? 'Copied' : 'Copy Trace'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Content view */}
            <div className="px-4 py-3">
              {activeTab === 'steps' ? (
                <div className="space-y-2.5">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 group">
                      <div className="mt-0.5 shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <span className="text-slate-300 leading-snug">
                          {step.label}
                        </span>
                        {step.duration && (
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {step.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/50 border border-white/10 rounded-xl p-3 max-h-64 overflow-y-auto font-mono text-[11px] text-purple-200/90 leading-relaxed whitespace-pre-wrap">
                  {reasoningTrace}
                </div>
              )}

              <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-indigo-400/80">
                <span className="flex items-center gap-1.5 italic">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Grounded via InGrowwth RCO &amp; ADR Consultant Knowledge Engine
                </span>
                <span className="font-mono text-slate-500">Zero-Hallucination Guardrail Active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
