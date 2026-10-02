'use client';

import React, { useState } from 'react';
import {
  LineChart,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface EvalRun {
  id: string;
  dataset: string;
  scoreGroundedness: number;
  scoreRelevance: number;
  avgLatency: number;
  passRate: number;
  date: string;
  status: 'PASSED' | 'FAILED' | 'RUNNING';
}

const HISTORICAL_RUNS: EvalRun[] = [
  {
    id: 'eval-run-104',
    dataset: 'enterprise-architecture-gold-v2 (150 cases)',
    scoreGroundedness: 97.4,
    scoreRelevance: 95.8,
    avgLatency: 310,
    passRate: 98.6,
    date: 'Today, 10:45 AM',
    status: 'PASSED',
  },
  {
    id: 'eval-run-103',
    dataset: 'cloud-security-compliance-test (80 cases)',
    scoreGroundedness: 98.2,
    scoreRelevance: 96.1,
    avgLatency: 285,
    passRate: 99.0,
    date: 'Yesterday, 4:20 PM',
    status: 'PASSED',
  },
  {
    id: 'eval-run-102',
    dataset: 'prompt-injection-adversarial (200 cases)',
    scoreGroundedness: 99.5,
    scoreRelevance: 94.0,
    avgLatency: 195,
    passRate: 100.0,
    date: '3 days ago',
    status: 'PASSED',
  },
  {
    id: 'eval-run-101',
    dataset: 'adr-synthesis-edge-cases (60 cases)',
    scoreGroundedness: 92.1,
    scoreRelevance: 89.4,
    avgLatency: 440,
    passRate: 93.3,
    date: '5 days ago',
    status: 'PASSED',
  },
];

export default function EvalsClient() {
  const [runs, setRuns] = useState(HISTORICAL_RUNS);
  const [isRunning, setIsRunning] = useState(false);

  const handleTriggerEval = () => {
    setIsRunning(true);
    setTimeout(() => {
      const newRun: EvalRun = {
        id: `eval-run-${Date.now().toString().slice(-3)}`,
        dataset: 'live-consultant-synthetic-evals (120 cases)',
        scoreGroundedness: 98.1,
        scoreRelevance: 96.4,
        avgLatency: 290,
        passRate: 99.2,
        date: 'Just now',
        status: 'PASSED',
      };
      setRuns([newRun, ...runs]);
      setIsRunning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Benchmark Header */}
      <div className="p-6 rounded-3xl bg-[#0e121d] border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LineChart className="w-5 h-5 text-indigo-400" />
              AI Evaluation &amp; Benchmark Suite
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Automated CI/CD Evaluator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Validate RAG retrieval groundedness, hallucination mitigation, and SLA benchmarks
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerEval}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Evaluating 120 Test Cases...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run Automated Benchmark</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Benchmark Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Groundedness */}
        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Groundedness Score</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">97.4%</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +1.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Zero ungrounded hallucination rate</p>
        </div>

        {/* Answer Relevance */}
        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Answer Relevance</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">95.8%</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +0.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Precision alignment with query intent</p>
        </div>

        {/* Latency Compliance */}
        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Latency SLA</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">99.4%</span>
            <span className="text-[11px] text-slate-400 font-mono">&lt; 1,000ms</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Percentile SLA threshold adherence</p>
        </div>

        {/* Guardrail Pass Rate */}
        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Security Guardrail</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">100%</span>
            <span className="text-[11px] text-emerald-400 font-mono">0 breaches</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Injection &amp; jailbreak resistance</p>
        </div>
      </div>

      {/* Historical Benchmark Runs Table */}
      <div className="rounded-3xl p-6 bg-[#0e121d] border border-white/10 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <LineChart className="w-4 h-4 text-purple-400" />
          Benchmark Execution Runs ({runs.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-5 py-3.5 rounded-l-xl">Run ID</th>
                <th className="px-5 py-3.5">Dataset</th>
                <th className="px-5 py-3.5">Groundedness</th>
                <th className="px-5 py-3.5">Relevance</th>
                <th className="px-5 py-3.5">Avg Latency</th>
                <th className="px-5 py-3.5">Pass Rate</th>
                <th className="px-5 py-3.5 rounded-r-xl">Executed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-slate-300 font-semibold">{run.id}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{run.dataset}</td>
                  <td className="px-5 py-3.5 font-mono text-emerald-400 font-bold">
                    {run.scoreGroundedness}%
                  </td>
                  <td className="px-5 py-3.5 font-mono text-indigo-300">{run.scoreRelevance}%</td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">{run.avgLatency}ms</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {run.passRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {run.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
