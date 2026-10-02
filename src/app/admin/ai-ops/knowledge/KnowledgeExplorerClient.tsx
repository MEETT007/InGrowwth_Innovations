'use client';

import React, { useState } from 'react';
import {
  Database,
  Search,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Tag,
} from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  name: string;
  category: string;
  chunks: number;
  tokens: number;
  updatedAt: string;
  status: 'INDEXED' | 'SYNCING' | 'PENDING';
}

const INITIAL_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    name: 'ADR-001: Distributed Event Streaming (Kafka vs SQS).md',
    category: 'Architecture Decision',
    chunks: 14,
    tokens: 4200,
    updatedAt: '2 hours ago',
    status: 'INDEXED',
  },
  {
    id: 'doc-2',
    name: 'InGrowwth Multi-Tenant Database Isolation Playbook.pdf',
    category: 'Database & Storage',
    chunks: 28,
    tokens: 9400,
    updatedAt: 'Yesterday',
    status: 'INDEXED',
  },
  {
    id: 'doc-3',
    name: 'Enterprise Cloud Security & Zero-Trust Compliance.md',
    category: 'Security & Auth',
    chunks: 19,
    tokens: 6100,
    updatedAt: '3 days ago',
    status: 'INDEXED',
  },
  {
    id: 'doc-4',
    name: 'Next.js 16 App Router SSR & Caching Blueprint.md',
    category: 'Frontend Engineering',
    chunks: 22,
    tokens: 7800,
    updatedAt: '4 days ago',
    status: 'INDEXED',
  },
  {
    id: 'doc-5',
    name: 'High-Concurrency Redis Caching & Stampede Prevention.md',
    category: 'Performance',
    chunks: 16,
    tokens: 5300,
    updatedAt: '5 days ago',
    status: 'INDEXED',
  },
];

const SAMPLE_SEARCH_RESULTS: Record<string, Array<{ title: string; match: number; text: string; source: string }>> = {
  default: [
    {
      title: 'ADR-001: Section 3.2 - Broker Partitioning Strategy',
      match: 94.6,
      text: 'For workloads exceeding 10k events/sec, topic partition keys must hash on tenant_id to prevent head-of-line blocking and guarantee in-order delivery.',
      source: 'ADR-001: Distributed Event Streaming (Kafka vs SQS).md',
    },
    {
      title: 'Database Playbook: Section 4 - Connection Pooling',
      match: 89.2,
      text: 'Neon PostgreSQL serverless connections require transaction-level pooling via PgBouncer or Prisma Accelerate to minimize latency under burst traffic.',
      source: 'InGrowwth Multi-Tenant Database Isolation Playbook.pdf',
    },
    {
      title: 'Security Blueprint: Section 2 - Token Rotation',
      match: 84.1,
      text: 'Stateless JWT verification coupled with short-lived tokens and Redis blacklisting provides cryptographic non-repudiation with instantaneous revocation.',
      source: 'Enterprise Cloud Security & Zero-Trust Compliance.md',
    },
  ],
};

export default function KnowledgeExplorerClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);
  const [results, setResults] = useState(SAMPLE_SEARCH_RESULTS.default);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResults(SAMPLE_SEARCH_RESULTS.default);
    }, 400);
  };

  const handleReindex = () => {
    setIsReindexing(true);
    setReindexSuccess(false);
    setTimeout(() => {
      setIsReindexing(false);
      setReindexSuccess(true);
      setTimeout(() => setReindexSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Knowledge Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Vector Engine</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">pgvector</div>
          <p className="text-[11px] text-emerald-400 mt-1 font-mono">Neon PostgreSQL Cluster</p>
        </div>

        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Indexed Documents</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{INITIAL_DOCS.length} Documents</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">ADRs &amp; Tech Playbooks</p>
        </div>

        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Embeddings</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">148 Vectors</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">1536-dim (text-embedding-3-small)</p>
        </div>

        <div className="rounded-2xl p-5 bg-[#0e121d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Index Health</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">100% Synced</div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">HNSW Cosine Distance Index</p>
        </div>
      </div>

      {/* Vector Semantic Search Playground */}
      <div className="rounded-3xl p-6 bg-[#0e121d] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Vector Semantic Search Playground
            </h3>
            <p className="text-xs text-slate-400">
              Test real-time embedding similarity and chunk retrieval directly from the vector store
            </p>
          </div>

          <button
            type="button"
            onClick={handleReindex}
            disabled={isReindexing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReindexing ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isReindexing ? 'Reindexing Store...' : reindexSuccess ? 'Reindexed!' : 'Sync Embeddings'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter technical query (e.g. 'Kafka partitioning strategy', 'Postgres connection pooling')..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
          >
            {isSearching ? 'Embedding...' : 'Vector Match'}
          </button>
        </form>

        {/* Results Stream */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Top Similarity Matches:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {results.map((res, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {res.match}% Match
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Rank #{idx + 1}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5">{res.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                    {res.text}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 truncate">
                  <span className="truncate max-w-[180px]">{res.source}</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Library Repository */}
      <div className="rounded-3xl p-6 bg-[#0e121d] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Knowledge Repository Documents ({INITIAL_DOCS.length})
            </h3>
            <p className="text-xs text-slate-400">
              ADRs, security playbooks, and architectural reference documents ingested into the RCO knowledge graph
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-5 py-3.5 rounded-l-xl">Document Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Chunks</th>
                <th className="px-5 py-3.5">Token Size</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 rounded-r-xl">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {INITIAL_DOCS.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                      <Tag className="w-3 h-3 text-purple-400" />
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">{doc.chunks} chunks</td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">{doc.tokens.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                    {doc.updatedAt}
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
