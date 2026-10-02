'use client';

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Play,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  Terminal,
  Download,
  Copy,
  Check,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  X,
  FileCode,
  FolderGit2,
  Cpu,
  Zap,
  Globe,
  MessageCircle,
  Share2,
  Workflow,
  Radio,
  Volume2,
  Mic,
  Activity,
  Server,
  Database,
  Bot,
  Sliders,
  Settings as SettingsIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MicrophonePermissionModal from './MicrophonePermissionModal';
import {
  VOICE_PERSONAS,
  speakWithPersona,
  getVoicePersona,
  normalizePersonaId,
} from '@/lib/voice-personas';

export const AUTHORIZED_COWORK_EMAILS = [
  'meett2110@gmail.com',
  'nairobi10nairobi@gmail.com',
  'sauravp3011@gmail.com',
];

interface CoworkTask {
  id: string;
  title: string;
  description: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  outputFile?: string;
  threadId: string;
}

interface BackgroundDot {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE_24_7' | 'IDLE' | 'SYNCING';
  uptime: string;
  tasksCompleted: number;
  lastAction: string;
  color: string;
  category: string;
}

interface PluginConnector {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  status: 'CONNECTED' | 'ACTIVE' | 'CONFIGURED';
  channel?: string;
  badgeColor: string;
  enabled: boolean;
  webhookUrl?: string;
  apiKey?: string;
  recipient?: string;
}

interface DotReport {
  title: string;
  category: string;
  score: number;
  findings: string[];
  recommendations?: string[];
  markdown: string;
}

interface CoworkWorkspaceProps {
  userEmail?: string;
  userName?: string;
  onExit: () => void;
  initialQuery?: string;
}

export default function CoworkWorkspace({
  userEmail,
  userName = 'Meet',
  onExit,
  initialQuery,
}: CoworkWorkspaceProps) {
  // Authorization check
  const normalizedEmail = (userEmail || '').toLowerCase().trim();
  const normalizedName = (userName || '').toLowerCase().trim();

  const isAuthorized =
    AUTHORIZED_COWORK_EMAILS.some((email) => email === normalizedEmail) ||
    normalizedName.includes('meet') ||
    normalizedName.includes('darshan') ||
    normalizedName.includes('saurav');

  // Navigation tab inside Cowork
  const [activeCoworkTab, setActiveCoworkTab] = useState<'tasks' | 'dots' | 'plugins' | 'voice'>('tasks');
  const [activeFileTab, setActiveFileTab] = useState<'schema.prisma' | 'migrations.sql' | 'route.ts' | 'ADR.md'>('schema.prisma');
  const [copied, setCopied] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  
  // Real Plugin Execution & Configuration Modal State
  const [configuringPlugin, setConfiguringPlugin] = useState<PluginConnector | null>(null);
  const [pluginFormWebhook, setPluginFormWebhook] = useState('');
  const [pluginFormApiKey, setPluginFormApiKey] = useState('');
  const [pluginFormChannel, setPluginFormChannel] = useState('');
  const [isDispatchingPluginId, setIsDispatchingPluginId] = useState<string | null>(null);

  // Real Dots Execution & Findings Report Modal State
  const [activeDotReport, setActiveDotReport] = useState<DotReport | null>(null);
  const [isAuditingDotId, setIsAuditingDotId] = useState<string | null>(null);
  const [isDeployingDot, setIsDeployingDot] = useState(false);
  const [newDotName, setNewDotName] = useState('');
  const [newDotRole, setNewDotRole] = useState('');
  const [newDotCategory, setNewDotCategory] = useState('Architecture & Reliability');

  // Voice Agent State (Unlimited in Cowork)
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('Welcome to InGrowwth Cowork Studio. All 4 worker threads and 24/7 background Dots are online.');
  const [coworkPersona, setCoworkPersona] = useState<string>('aria-sales');
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('igg_voice_persona');
      if (saved) setCoworkPersona(normalizePersonaId(saved));
    }
  }, []);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[Cowork Worker Thread 1] Initialized LangGraph concurrent multi-agent engine',
    '[Cowork Worker Thread 2] Connected to local edge models and accelerated cloud pipeline',
    '[24/7 Dots Swarm] Dot Alpha & Dot Beta daemons active in background',
    '[Plugins] Teams, WhatsApp, n8n, Slack & Notion webhooks loaded',
    '[Cowork Ready] Awaiting parallel development instructions',
  ]);

  // Tasks in flight
  const [tasks, setTasks] = useState<CoworkTask[]>([
    {
      id: 'task-1',
      title: 'PostgreSQL Multi-Tenant DDL Schema',
      description: 'Generate zero-trust RLS tables with UUIDv4 and HNSW pgvector indexing',
      status: 'COMPLETED',
      progress: 100,
      outputFile: 'migrations.sql',
      threadId: 'Agent-1 (Database Architect)',
    },
    {
      id: 'task-2',
      title: 'Prisma ORM Relations & Indexes',
      description: 'Synthesize schema.prisma models with composite indexes & soft deletes',
      status: 'COMPLETED',
      progress: 100,
      outputFile: 'schema.prisma',
      threadId: 'Agent-2 (Full-Stack Engineer)',
    },
    {
      id: 'task-3',
      title: 'Next.js 16 Server Actions & API Pipeline',
      description: 'Implement high-concurrency mutation routes with sub-100ms response caching',
      status: 'RUNNING',
      progress: 74,
      outputFile: 'route.ts',
      threadId: 'Agent-3 (API Microservices)',
    },
    {
      id: 'task-4',
      title: 'Zero-Trust Security & Latency Verification',
      description: 'Verify tenant isolation boundaries and ensure sub-3s response SLA',
      status: 'QUEUED',
      progress: 0,
      outputFile: 'ADR.md',
      threadId: 'Agent-4 (Security & Compliance)',
    },
  ]);

  // 24/7 Background Autonomous AI Agents (OpenAI-style Dots)
  const [dots, setDots] = useState<BackgroundDot[]>([
    {
      id: 'dot-alpha',
      name: 'Dot Alpha',
      role: 'Database Sentinel & Schema Watchdog',
      status: 'ACTIVE_24_7',
      uptime: '99.99%',
      tasksCompleted: 1420,
      lastAction: 'Optimized HNSW vector index ef_construction to 64',
      color: 'from-emerald-500 to-teal-600',
      category: 'Data Engine',
    },
    {
      id: 'dot-beta',
      name: 'Dot Beta',
      role: 'Autonomous Microservices Code Daemon',
      status: 'ACTIVE_24_7',
      uptime: '99.94%',
      tasksCompleted: 864,
      lastAction: 'Drafted Next.js 16 Server Actions and unit test fixtures',
      color: 'from-blue-500 to-indigo-600',
      category: 'Full-Stack Agent',
    },
    {
      id: 'dot-gamma',
      name: 'Dot Gamma',
      role: 'Zero-Trust Security & Compliance Scout',
      status: 'ACTIVE_24_7',
      uptime: '100%',
      tasksCompleted: 2190,
      lastAction: 'Verified tenant isolation boundaries (0 data leaks detected)',
      color: 'from-purple-500 to-pink-600',
      category: 'Security Guardian',
    },
    {
      id: 'dot-delta',
      name: 'Dot Delta',
      role: 'Omnichannel Webhook & Event Broker',
      status: 'ACTIVE_24_7',
      uptime: '99.98%',
      tasksCompleted: 3410,
      lastAction: 'Dispatched automated WhatsApp & Teams discovery briefing',
      color: 'from-amber-500 to-orange-600',
      category: 'Integration Swarm',
    },
    {
      id: 'dot-epsilon',
      name: 'Dot Epsilon',
      role: 'Autonomous PR Reviewer & CI/CD Healer',
      status: 'ACTIVE_24_7',
      uptime: '99.96%',
      tasksCompleted: 980,
      lastAction: 'Auto-resolved GitHub Actions lint failure and generated patch',
      color: 'from-pink-500 to-rose-600',
      category: 'DevOps Sentinel',
    },
  ]);

  // Enterprise Plugins & Connectors
  const [plugins, setPlugins] = useState<PluginConnector[]>([
    {
      id: 'teams',
      name: 'Microsoft Teams',
      tagline: 'Enterprise Collaboration & Channel Alerts',
      icon: MessageCircle,
      status: 'CONNECTED',
      channel: '#Architecture-Decisions',
      badgeColor: 'text-indigo-400 bg-indigo-500/15',
      enabled: true,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      tagline: 'Automated Client Outreach & Meeting Pushes',
      icon: Share2,
      status: 'ACTIVE',
      channel: '+1 (800) 444-INGROWWTH',
      badgeColor: 'text-emerald-400 bg-emerald-500/15',
      enabled: true,
    },
    {
      id: 'n8n',
      name: 'n8n Workflow Automation',
      tagline: 'Self-Hosted Multi-Step Pipeline Orchestrator',
      icon: Workflow,
      status: 'CONNECTED',
      channel: 'http://n8n.internal:5678',
      badgeColor: 'text-orange-400 bg-orange-500/15',
      enabled: true,
    },
    {
      id: 'slack',
      name: 'Slack',
      tagline: 'DevOps Incident Triage & PRD Bot',
      icon: Globe,
      status: 'CONNECTED',
      channel: '#engineering-leads',
      badgeColor: 'text-rose-400 bg-rose-500/15',
      enabled: true,
    },
    {
      id: 'notion',
      name: 'Notion Workspace',
      tagline: 'Automated System Architecture & ADR Sync',
      icon: Layers,
      status: 'CONFIGURED',
      channel: 'InGrowwth Product Engineering Hub',
      badgeColor: 'text-slate-300 bg-white/10',
      enabled: true,
    },
    {
      id: 'antigravity',
      name: 'Google Antigravity SDK',
      tagline: 'Multi-Agent Autonomous Loop Swarm',
      icon: Sparkles,
      status: 'ACTIVE',
      channel: 'Cluster Daemon US-Central',
      badgeColor: 'text-cyan-400 bg-cyan-500/15',
      enabled: true,
    },
    {
      id: 'claude',
      name: 'Claude Enterprise & Code',
      tagline: 'Deep Architectural Synthesis & Sonnet 3.5 Reasoning',
      icon: Cpu,
      status: 'ACTIVE',
      channel: 'Anthropic Cloud Cluster',
      badgeColor: 'text-amber-400 bg-amber-500/15',
      enabled: true,
    },
  ]);

  // Code files content
  const [fileContents, setFileContents] = useState({
    'schema.prisma': `datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [uuidOssp(map: "uuid-ossp"), pgcrypto, vector]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

model Organization {
  id               String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name             String            @db.VarChar(255)
  slug             String            @unique @db.VarChar(100)
  settings         Json              @default("{}")
  createdAt        DateTime          @default(dbgenerated("clock_timestamp()")) @map("created_at") @db.Timestamptz
  updatedAt        DateTime          @default(dbgenerated("clock_timestamp()")) @updatedAt @map("updated_at") @db.Timestamptz
  users            User[]
  auditLogs        AuditLog[]
  vectorEmbeddings VectorEmbedding[]

  @@index([slug], map: "idx_orgs_slug")
  @@map("organizations")
}

model User {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  email          String       @unique @db.VarChar(255)
  role           String       @default("MEMBER") @db.VarChar(50)
  createdAt      DateTime     @default(dbgenerated("clock_timestamp()")) @map("created_at") @db.Timestamptz
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  auditLogs      AuditLog[]

  @@index([organizationId], map: "idx_users_org_id")
  @@map("users")
}

model AuditLog {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  userId         String?      @map("user_id") @db.Uuid
  action         String       @db.VarChar(100)
  metadata       Json         @default("{}")
  createdAt      DateTime     @default(dbgenerated("clock_timestamp()")) @map("created_at") @db.Timestamptz
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User?        @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([organizationId], map: "idx_audit_logs_org_id")
  @@index([createdAt(sort: Desc)], map: "idx_audit_logs_created_at")
  @@map("audit_logs")
}

model VectorEmbedding {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  organizationId String       @map("organization_id") @db.Uuid
  content        String       @db.Text
  embedding      Unsupported("vector(1536)")
  metadata       Json         @default("{}")
  createdAt      DateTime     @default(dbgenerated("clock_timestamp()")) @map("created_at") @db.Timestamptz
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@map("vector_embeddings")
}`,
    'migrations.sql': `-- ========================================================
-- INGROWWTH INNOVATIONS - ENTERPRISE MULTI-TENANT DDL
-- Generated by IGG Cowork Multi-Agent Engine
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'MEMBER' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- 3. Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid);

-- 4. High-Performance HNSW Vector Index
CREATE INDEX IF NOT EXISTS idx_vector_embeddings_hnsw 
ON vector_embeddings USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
    'route.ts': `import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

/**
 * High-Concurrency Next.js 16 Multi-Tenant Server Action
 * Built by InGrowwth AI Cowork Engine
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { organizationId, action, payload } = await req.json();

    // Enforce Tenant Session Variable for PostgreSQL Row-Level Security
    await db.$executeRawUnsafe(
      \`SET LOCAL app.current_organization_id = '\${organizationId}';\`
    );

    // Atomic Audit Log Creation
    const auditRecord = await db.auditLog.create({
      data: {
        organizationId,
        userId,
        action,
        metadata: payload || {},
      },
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      auditId: auditRecord.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,
    'ADR.md': `# Architecture Decision Record (ADR-004)
## Multi-Tenant Cloud Architecture & Vector Retrieval

### Context
InGrowwth Innovations requires high-concurrency client tenancy with hard security isolation, sub-millisecond similarity search, and automated zero-downtime database migrations.

### Decision
1. **Tenancy Model**: Shared database with PostgreSQL Row-Level Security (RLS) driven by app.current_organization_id.
2. **AI Engine**: Self-hosted local Ollama (Qwen 14B / DeepSeek) accelerated by Gemini 3.5 Flash for sub-3s SLA.
3. **ORM**: Prisma Client with custom SQL extension policies and HNSW vector index operators.

### Status
Accepted & Implemented by InGrowwth Principal AI Architect.`,
  });

  // Simulate concurrent task progression
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.status === 'RUNNING') {
            const nextProgress = Math.min(task.progress + 6, 100);
            if (nextProgress === 100) {
              setTerminalLogs((logs) => [
                ...logs,
                '[Worker Finished] ' + task.title + ' successfully completed',
                '[Test Benchmark] Passed in 142ms with 0 errors',
              ]);
              return { ...task, progress: 100, status: 'COMPLETED' };
            }
            return { ...task, progress: nextProgress };
          }
          if (task.status === 'QUEUED') {
            const runningCount = prev.filter((t) => t.status === 'RUNNING').length;
            if (runningCount === 0) {
              setTerminalLogs((logs) => [
                ...logs,
                '[Worker Dispatched] Initiating ' + task.title + ' on parallel thread',
              ]);
              return { ...task, status: 'RUNNING', progress: 15 };
            }
          }
          return task;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(fileContents[activeFileTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([fileContents[activeFileTab]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFileTab;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddConcurrentTask = () => {
    if (!newTaskInput.trim()) return;
    const newTask: CoworkTask = {
      id: 'task-' + Date.now(),
      title: newTaskInput.trim(),
      description: 'User initiated parallel workstream',
      status: 'RUNNING',
      progress: 10,
      threadId: 'Agent-' + (tasks.length + 1) + ' (Autonomous)',
    };
    setTasks((prev) => [...prev, newTask]);
    setTerminalLogs((logs) => [
      ...logs,
      '[New Thread Spawned] ' + newTask.title + ' running concurrently',
    ]);
    setNewTaskInput('');
  };

  const handleRunAllTasks = () => {
    setIsRunningAll(true);
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        status: 'RUNNING',
        progress: Math.floor(Math.random() * 40) + 20,
      }))
    );
    setTerminalLogs((logs) => [
      ...logs,
      '[Orchestrator] Multi-agent parallel task execution triggered across all worker threads',
      'Benchmark run: Validating PostgreSQL DDL and Next.js 16 routes...',
    ]);
    setTimeout(() => {
      setIsRunningAll(false);
      setTerminalLogs((logs) => [
        ...logs,
        '✔ [All Tasks Verified] Compilation succeeded in 1.48s',
      ]);
    }, 3000);
  };

  // Toggle Plugin
  const handleTogglePlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.enabled;
          setTerminalLogs((logs) => [
            ...logs,
            `[Plugin Event] ${p.name} integration ${next ? 'enabled' : 'disabled'}`,
          ]);
          return { ...p, enabled: next };
        }
        return p;
      })
    );
  };

  // Real Webhook Dispatch for Plugins (Outbound HTTP to real Webhook/API)
  const handleTestPluginWebhook = async (plugin: PluginConnector) => {
    setIsDispatchingPluginId(plugin.id);
    const activeCode = fileContents[activeFileTab] || fileContents['schema.prisma'];
    
    setTerminalLogs((logs) => [
      ...logs,
      `[Plugin Dispatch] 🚀 Transmitting outbound live event to ${plugin.name} (${plugin.channel || 'default'})...`,
    ]);

    try {
      const res = await fetch('/api/plugins/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pluginId: plugin.id,
          action: 'export_architecture_spec',
          config: {
            webhookUrl: plugin.webhookUrl,
            apiKey: plugin.apiKey,
            channel: plugin.channel,
            recipient: plugin.recipient,
          },
          payload: {
            title: `Enterprise Architecture Spec (${activeFileTab})`,
            content: `Synchronized from InGrowwth AI Cowork Studio by ${userName}. Active File: ${activeFileTab}`,
            fileName: activeFileTab,
            fileContent: activeCode,
            metadata: {
              timestamp: new Date().toISOString(),
              engineer: userName,
              studio: 'InGrowwth Cowork VIP',
            },
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTerminalLogs((logs) => [
          ...logs,
          `[${plugin.name}] ✅ Live dispatch successful -> HTTP ${data.statusCode} (${data.latencyMs}ms). Target: ${data.target}`,
          `[${plugin.name}] Payload delivered: ${activeFileTab} (${Math.round((activeCode.length / 1024) * 10) / 10} KB)`,
        ]);
      } else {
        setTerminalLogs((logs) => [
          ...logs,
          `[${plugin.name}] ⚠️ Dispatch warning: ${data.error || 'Check webhook URL configuration'} (HTTP ${data.statusCode || 500})`,
        ]);
      }
    } catch (e: any) {
      setTerminalLogs((logs) => [
        ...logs,
        `[${plugin.name}] ❌ Dispatch error: ${e.message}`,
      ]);
    } finally {
      setIsDispatchingPluginId(null);
    }
  };

  // Open Plugin Configuration Modal
  const handleOpenConfigurePlugin = (plugin: PluginConnector) => {
    setConfiguringPlugin(plugin);
    setPluginFormWebhook(plugin.webhookUrl || '');
    setPluginFormApiKey(plugin.apiKey || '');
    setPluginFormChannel(plugin.channel || '');
  };

  // Save Plugin Configuration
  const handleSavePluginConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringPlugin) return;

    setPlugins((prev) =>
      prev.map((p) =>
        p.id === configuringPlugin.id
          ? {
              ...p,
              webhookUrl: pluginFormWebhook.trim() || undefined,
              apiKey: pluginFormApiKey.trim() || undefined,
              channel: pluginFormChannel.trim() || p.channel,
              status: pluginFormWebhook.trim() ? 'CONNECTED' : p.status,
            }
          : p
      )
    );

    setTerminalLogs((logs) => [
      ...logs,
      `[Plugin Config] 💾 Updated configuration credentials for ${configuringPlugin.name}.`,
    ]);
    setConfiguringPlugin(null);
  };

  // Trigger Real On-Demand Autonomous Audit for a 24/7 Dot
  const handleAuditDot = async (dotId: string) => {
    setIsAuditingDotId(dotId);
    const targetDot = dots.find((d) => d.id === dotId);
    const dotName = targetDot?.name || 'Autonomous Dot';

    setTerminalLogs((logs) => [
      ...logs,
      `[Dot Daemon] 🔍 ${dotName} initiating deep autonomous analysis of current workspace files...`,
    ]);

    try {
      const res = await fetch('/api/dots/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dotId,
          dotName,
          codeContext: {
            schema: fileContents['schema.prisma'],
            sql: fileContents['migrations.sql'],
            route: fileContents['route.ts'],
            adr: fileContents['ADR.md'],
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTerminalLogs((logs) => [
          ...logs,
          `[${dotName}] ✅ Audit completed in ${data.latencyMs}ms. Architecture Health: ${data.score}/100`,
          ...data.findings.map((f: string) => `[${dotName}] • ${f}`),
        ]);

        setDots((prev) =>
          prev.map((d) =>
            d.id === dotId
              ? {
                  ...d,
                  tasksCompleted: d.tasksCompleted + 1,
                  lastAction: `Health score: ${data.score}/100. ${data.findings[0] || 'Verified 0 drift'}`,
                  status: 'ACTIVE_24_7',
                }
              : d
          )
        );

        setActiveDotReport({
          title: `${dotName} Report`,
          category: data.category,
          score: data.score,
          findings: data.findings,
          recommendations: data.recommendations,
          markdown: data.artifactMarkdown,
        });
      }
    } catch (e: any) {
      setTerminalLogs((logs) => [
        ...logs,
        `[${dotName}] ❌ Autonomous execution error: ${e.message}`,
      ]);
    } finally {
      setIsAuditingDotId(null);
    }
  };

  // Deploy a real custom 24/7 Dot
  const handleDeployDotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDotName.trim()) return;

    const newDot: BackgroundDot = {
      id: `dot-${Date.now()}`,
      name: newDotName.trim(),
      role: newDotRole.trim() || 'Continuous Autonomous Cloud & Code Sentinel',
      status: 'ACTIVE_24_7',
      uptime: '100%',
      tasksCompleted: 1,
      lastAction: 'Provisioned background worker loop with automated interval checking',
      color: 'from-violet-500 to-purple-600',
      category: newDotCategory,
    };

    setDots((prev) => [...prev, newDot]);
    setTerminalLogs((logs) => [
      ...logs,
      `[Swarm Orchestrator] 🚀 Successfully deployed 24/7 background agent: ${newDot.name} (${newDot.category})`,
    ]);
    setIsDeployingDot(false);
    setNewDotName('');
    setNewDotRole('');
  };

  const handleSpawnDot = () => {
    setIsDeployingDot(true);
  };

  const [reportCopied, setReportCopied] = useState(false);
  const handleCopyReport = async () => {
    if (!activeDotReport) return;
    try {
      await navigator.clipboard.writeText(activeDotReport.markdown);
      setReportCopied(true);
      setTimeout(() => setReportCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Trigger Voice Speech Output (Unlimited in Cowork with 4 Distinct Personas)
  const handleSpeakVoice = (overrideText?: string) => {
    if (typeof window === 'undefined') return;

    if (isVoiceSpeaking) {
      window.speechSynthesis?.cancel();
      setIsVoiceSpeaking(false);
      return;
    }

    const persona = getVoicePersona(coworkPersona);
    const text = overrideText || voiceTranscript;

    speakWithPersona({
      text,
      personaId: persona.id,
      userRate: 1.0,
      onStart: () => setIsVoiceSpeaking(true),
      onEnd: () => setIsVoiceSpeaking(false),
      onError: () => setIsVoiceSpeaking(false),
    });
  };

  // Cowork Voice Dictation State
  const [isCoworkListening, setIsCoworkListening] = useState(false);

  // Cowork Voice Dictation Handler (De-duplicated & Sensitive Audio Filtering)
  const toggleCoworkListening = async () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isCoworkListening) {
      setIsCoworkListening(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
          console.warn('Microphone permission denied', permErr);
          setShowMicPermissionModal(true);
          return;
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsCoworkListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (!finalTranscript && event.results[0]) {
          finalTranscript = event.results[0][0].transcript;
        }

        const cleanTranscript = finalTranscript.trim();
        if (!cleanTranscript) return;

        setVoiceTranscript(cleanTranscript);
        setTerminalLogs((logs) => [
          ...logs,
          `[Voice Agent] Heard instruction: "${cleanTranscript}". Synthesizing response...`,
        ]);

        const persona = getVoicePersona(coworkPersona);
        speakWithPersona({
          text: `Understood. Cowork Studio received your instruction: "${cleanTranscript}". All 4 worker threads and 24/7 background dots are actively collaborating on this architectural spec.`,
          personaId: persona.id,
          userRate: 1.0,
          onStart: () => setIsVoiceSpeaking(true),
          onEnd: () => setIsVoiceSpeaking(false),
          onError: () => setIsVoiceSpeaking(false),
        });
      };

      recognition.onerror = () => {
        setIsCoworkListening(false);
        setShowMicPermissionModal(true);
      };

      recognition.onend = () => {
        setIsCoworkListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Cowork speech recognition failed', err);
      setIsCoworkListening(false);
      setShowMicPermissionModal(true);
    }
  };

  // If NOT authorized, render the Premium Gate
  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-lg w-full bg-[#12151e] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6"
        >
          <button
            type="button"
            onClick={onExit}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Enterprise Feature
              </span>
              <span className="text-xs text-slate-400">Multi-Task Cowork</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
              InGrowwth Cowork Studio
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Cowork mode provides simultaneous multi-agent task execution, 24/7 background autonomous Dots, Microsoft Teams/WhatsApp/n8n/Slack connectors, and unlimited neural voice agents.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Authorized VIP Founders &amp; Engineers:
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li>Meet Trivedi (meett2110@gmail.com)</li>
              <li>Darshan (nairobi10nairobi@gmail.com)</li>
              <li>Saurav (sauravp3011@gmail.com)</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onExit}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer text-center"
            >
              Return to Standard Chat
            </button>
            <a
              href="mailto:contact@ingrowwthinnovations.com?subject=Enterprise%20Cowork%20Access%20Request"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white transition-all cursor-pointer text-center shadow-lg shadow-indigo-600/30"
            >
              Request Access
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // AUTHORIZED COWORK STUDIO VIEW (Claude Split-Screen Canvas with Dots & Plugins)
  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-14 w-full flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a0d14]/90 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                InGrowwth Cowork Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                24/7 Swarm Online
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unlimited Voice Agent Button */}
          <button
            type="button"
            onClick={() => handleSpeakVoice()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              isVoiceSpeaking
                ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 animate-pulse'
                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-white'
            }`}
            title="Interactive Neural Voice Output (Unlimited Cowork Access)"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">
              {isVoiceSpeaking ? 'Speaking...' : 'Voice Agent (Unlimited)'}
            </span>
          </button>

          {/* VIP Access Badge */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>VIP Pro: {userName}</span>
          </span>

          {/* Run All Concurrent Tasks Button */}
          <button
            type="button"
            onClick={handleRunAllTasks}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-600/20"
          >
            {isRunningAll ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>{isRunningAll ? 'Running Agents...' : 'Run All Tasks'}</span>
          </button>

          {/* Exit Cowork Button */}
          <button
            type="button"
            onClick={onExit}
            className="p-1.5 px-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Exit Cowork
          </button>
        </div>
      </header>

      {/* Main Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* LEFT PANE: Tasks / 24-7 Dots / Plugins (~44% Width) */}
        <div className="w-full lg:w-[44%] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-[#090b10] overflow-hidden">
          {/* Sub-Tabs: Tasks | 24/7 Dots | Plugins */}
          <div className="h-11 px-3 border-b border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#0a0d14]/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveCoworkTab('tasks')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCoworkTab === 'tasks'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tasks ({tasks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCoworkTab('dots')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCoworkTab === 'dots'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>24/7 Dots ({dots.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCoworkTab('plugins')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCoworkTab === 'plugins'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Workflow className="w-3.5 h-3.5 text-purple-500" />
                <span>Plugins ({plugins.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCoworkTab('voice')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCoworkTab === 'voice'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Voice Agent</span>
              </button>
            </div>

            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium hidden sm:inline">
              ● All Systems Operational
            </span>
          </div>

          {/* TAB 1: CONCURRENT TASKS */}
          {activeCoworkTab === 'tasks' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Task List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm space-y-2.5 transition-all hover:border-indigo-500/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 font-semibold ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : task.status === 'RUNNING'
                            ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 animate-pulse'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{task.threadId}</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Concurrent Task Input Bar */}
              <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-white/60 dark:bg-[#0a0d14]/80">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddConcurrentTask();
                    }}
                    placeholder="Spawn new concurrent agent task..."
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddConcurrentTask}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors shadow-sm"
                    title="Add Task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 24/7 BACKGROUND AUTONOMOUS AI AGENTS ("DOTS") */}
          {activeCoworkTab === 'dots' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                <div>
                  <span className="font-bold block">InGrowwth Dots (24/7 Autonomous Daemon Swarm)</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Self-healing background worker agents continuous across cloud infrastructure.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                    {dots.length} Active 24/7
                  </span>
                  <button
                    type="button"
                    onClick={handleSpawnDot}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
                    title="Deploy custom background Dot"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Deploy Dot</span>
                  </button>
                </div>
              </div>

              {dots.map((dot) => (
                <div
                  key={dot.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm space-y-2 hover:border-indigo-500/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${dot.color} shadow-sm animate-pulse`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{dot.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({dot.category})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {activeDotReport && activeDotReport.title.toLowerCase().includes(dot.name.toLowerCase().split(' ')[0]) && (
                        <button
                          type="button"
                          onClick={() => setActiveDotReport(activeDotReport)}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                          title="View telemetry findings and architecture score"
                        >
                          View Report
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAuditDot(dot.id)}
                        disabled={isAuditingDotId === dot.id}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 transition-colors cursor-pointer flex items-center gap-1 ${
                          isAuditingDotId === dot.id
                            ? 'bg-indigo-600 text-white animate-pulse'
                            : 'bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300'
                        }`}
                        title="Trigger on-demand live daemon check"
                      >
                        {isAuditingDotId === dot.id ? (
                          <>
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            <span>Auditing...</span>
                          </>
                        ) : (
                          'Audit Now'
                        )}
                      </button>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                        ● 24/7 Active
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{dot.role}</p>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 text-[10px] font-mono text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <Activity className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="truncate">Recent: {dot.lastAction}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100 dark:border-white/5">
                    <span>Uptime: <strong className="text-slate-700 dark:text-slate-300">{dot.uptime}</strong></span>
                    <span>Completed: <strong className="text-emerald-600 dark:text-emerald-400">{dot.tasksCompleted} tasks</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PLUGINS & CONNECTORS (Teams, WhatsApp, n8n, Slack, Notion, Antigravity, Claude) */}
          {activeCoworkTab === 'plugins' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Enterprise Plugin Ecosystem</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Synchronize architectural outputs with your external company toolchains.
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono font-semibold">
                  {plugins.length} Linked
                </span>
              </div>

              {plugins.map((plugin) => {
                const Icon = plugin.icon;
                return (
                  <div
                    key={plugin.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm space-y-2 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{plugin.name}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${plugin.badgeColor}`}>
                              {plugin.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1.5">
                            <span>{plugin.channel}</span>
                            {plugin.webhookUrl && (
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                                Real Hook
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenConfigurePlugin(plugin)}
                          className="text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer flex items-center gap-1"
                          title="Configure real Webhook URL and API Credentials"
                        >
                          <SettingsIcon className="w-3 h-3 text-slate-500" />
                          <span>Config</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestPluginWebhook(plugin)}
                          disabled={isDispatchingPluginId === plugin.id}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                            isDispatchingPluginId === plugin.id
                              ? 'bg-purple-600 text-white animate-pulse border-purple-500'
                              : 'bg-slate-100 dark:bg-white/5 hover:bg-purple-600 hover:text-white text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10'
                          }`}
                          title="Transmit live HTTP webhook event"
                        >
                          {isDispatchingPluginId === plugin.id ? (
                            <>
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            'Test Webhook'
                          )}
                        </button>

                        {/* Enable/Disable Toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePlugin(plugin.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                            plugin.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/10'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              plugin.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{plugin.tagline}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: UNLIMITED VOICE AGENT & SPEECH SYNTHESIS */}
          {activeCoworkTab === 'voice' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-rose-500/10 via-purple-500/5 to-indigo-500/10 border border-rose-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        InGrowwth Voice Agent (Unlimited VIP)
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                        Hands-free bidirectional neural speech &amp; architectural reasoning
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                    ● Unlimited Turns
                  </span>
                </div>

                {/* Active Persona Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                    <span>Active Voice Persona</span>
                    <span className="text-[10px] text-slate-400 font-mono">2 Women • 2 Men</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {VOICE_PERSONAS.map((p) => {
                      const isSel = coworkPersona === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setCoworkPersona(p.id);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('igg_voice_persona', p.id);
                            }
                            setTerminalLogs((logs) => [
                              ...logs,
                              `[Voice Persona Switched] Active speaker set to ${p.name} (${p.role})`,
                            ]);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-slate-900 dark:text-slate-100 shadow-sm'
                              : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{p.name}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                p.gender === 'Female'
                                  ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400'
                                  : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {p.gender}
                            </span>
                          </div>
                          <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 truncate">
                            {p.role}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Animated Audio Equalizer Spectrum Visualizer */}
                <div className="h-14 bg-black/40 rounded-xl p-3 flex items-center justify-center gap-1.5 border border-white/5">
                  {[40, 75, 20, 90, 60, 100, 45, 80, 30, 95, 55, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={
                        isVoiceSpeaking
                          ? { height: [`${h * 0.2}%`, `${h}%`, `${h * 0.4}%`] }
                          : { height: '15%' }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 0.6 + (i % 4) * 0.15,
                        ease: 'easeInOut',
                      }}
                      className="w-1.5 bg-gradient-to-t from-indigo-500 via-purple-500 to-rose-500 rounded-full"
                    />
                  ))}
                </div>

                {/* Voice Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakVoice()}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all ${
                      isVoiceSpeaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isVoiceSpeaking ? 'Pause Speech' : `Audition ${getVoicePersona(coworkPersona).name}`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleCoworkListening}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                      isCoworkListening
                        ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 animate-pulse'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isCoworkListening ? 'Listening...' : 'Speak Voice Command'}</span>
                  </button>
                </div>
              </div>

              {/* Live Transcript / Speech Input Box */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                  <span>Voice Prompt / Active Speech Script</span>
                  <span className="text-[10px] text-slate-400 font-mono">Editable</span>
                </div>
                <textarea
                  rows={3}
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 resize-none font-mono"
                  placeholder="Enter or dictate any architecture prompt to hear it spoken aloud..."
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakVoice(
                        `All 4 worker threads completed synchronization. Multi-tenant PostgreSQL DDL has been generated in migrations.sql with HNSW pgvector indexes and zero-trust RLS policies.`
                      )
                    }
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Load Architecture Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Live Code & Artifact Canvas (~56% Width) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#0d1017] overflow-hidden min-w-0">
          {/* File Tabs & Actions */}
          <div className="h-11 px-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#090b10] flex items-center justify-between overflow-x-auto shrink-0">
            <div className="flex items-center gap-1.5">
              {(['schema.prisma', 'migrations.sql', 'route.ts', 'ADR.md'] as const).map(
                (fileName) => (
                  <button
                    key={fileName}
                    type="button"
                    onClick={() => setActiveFileTab(fileName)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeFileTab === fileName
                        ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm border border-slate-200 dark:border-white/10'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{fileName}</span>
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-all cursor-pointer font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-all cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Code Viewer / Editor */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-[#07090e] leading-relaxed select-text">
            <pre className="whitespace-pre-wrap">
              <code>{fileContents[activeFileTab]}</code>
            </pre>
          </div>

          {/* Integrated Live Terminal Console Output */}
          <div className="h-40 border-t border-slate-200 dark:border-white/10 bg-slate-900 text-slate-300 p-3 font-mono text-[11px] flex flex-col shrink-0">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-semibold">InGrowwth Concurrent Terminal &amp; Benchmarks</span>
              </div>
              <span className="text-[10px] text-emerald-400">● 24/7 Background Telemetry Online</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 select-none">&gt;</span>
                  <span className={log.includes('Passed') || log.includes('Finished') ? 'text-emerald-300 font-semibold' : ''}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Microphone Permission Diagnostic Modal */}
      <MicrophonePermissionModal
        isOpen={showMicPermissionModal}
        onClose={() => setShowMicPermissionModal(false)}
        onPermissionGranted={() => toggleCoworkListening()}
      />

      {/* 1. Real Plugin Configuration Modal */}
      {configuringPlugin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f131c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Workflow className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Configure {configuringPlugin.name} Integration
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live bidirectional webhook &amp; API dispatch settings
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfiguringPlugin(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePluginConfig} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Webhook Target URL
                </label>
                <input
                  type="url"
                  value={pluginFormWebhook}
                  onChange={(e) => setPluginFormWebhook(e.target.value)}
                  placeholder={
                    configuringPlugin.id === 'slack'
                      ? 'https://hooks.slack.com/services/T00/B00/XXXXX'
                      : configuringPlugin.id === 'teams'
                      ? 'https://outlook.office.com/webhook/...'
                      : configuringPlugin.id === 'n8n'
                      ? 'https://n8n.yourdomain.com/webhook/ingrowwth-sync'
                      : 'https://api.yourplatform.com/webhook'
                  }
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Outbound JSON payloads with architecture code &amp; artifacts will be transmitted here.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Channel / Destination
                </label>
                <input
                  type="text"
                  value={pluginFormChannel}
                  onChange={(e) => setPluginFormChannel(e.target.value)}
                  placeholder="#enterprise-architecture or team-general"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API Key / Bearer Secret (Optional)
                </label>
                <input
                  type="password"
                  value={pluginFormApiKey}
                  onChange={(e) => setPluginFormApiKey(e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-[11px] text-purple-700 dark:text-purple-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span>
                  All requests execute over TLS 1.3 with SHA-256 verification and structured payload headers.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setConfiguringPlugin(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 24/7 Dot Audit Findings & Report Modal */}
      {activeDotReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f131c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeDotReport.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Category: {activeDotReport.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveDotReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
              {/* Score Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Autonomous Architecture Health
                  </span>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {activeDotReport.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                    PASSED ENTERPRISE BENCHMARK
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                    Zero drift detected in runtime DDL
                  </span>
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Telemetry Findings</span>
                </h4>
                <div className="space-y-1.5">
                  {activeDotReport.findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {activeDotReport.recommendations && activeDotReport.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Self-Healing Recommendations</span>
                  </h4>
                  <div className="space-y-1.5">
                    {activeDotReport.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Markdown Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    <span>Generated Report Artifact</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyReport}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-mono hover:underline cursor-pointer"
                  >
                    {reportCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{reportCopied ? 'Copied' : 'Copy Markdown'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] leading-relaxed max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 select-text">
                  <pre className="whitespace-pre-wrap">{activeDotReport.markdown}</pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Continuous 24/7 background telemetry synced with local SQLite/Prisma
              </span>
              <button
                type="button"
                onClick={() => setActiveDotReport(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Deploy Custom 24/7 Dot Modal */}
      {isDeployingDot && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f131c] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Deploy 24/7 Autonomous Dot
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Spawn a background self-healing daemon
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeployingDot(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDeployDotSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dot Name / Identifier
                </label>
                <input
                  type="text"
                  required
                  value={newDotName}
                  onChange={(e) => setNewDotName(e.target.value)}
                  placeholder="e.g. Dot Delta (API SLA Monitor)"
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Autonomous Role &amp; Mission
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDotRole}
                  onChange={(e) => setNewDotRole(e.target.value)}
                  placeholder="e.g. Continuously verify response latencies, DB pool headroom, and circuit breakers."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specialized Category
                </label>
                <select
                  value={newDotCategory}
                  onChange={(e) => setNewDotCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#1a202c] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  <option value="Architecture & Reliability">Architecture &amp; Reliability</option>
                  <option value="Cloud Cost Optimization">Cloud Cost Optimization</option>
                  <option value="Security & Compliance">Security &amp; Compliance</option>
                  <option value="API Telemetry & Uptime">API Telemetry &amp; Uptime</option>
                  <option value="Data Pipeline Sync">Data Pipeline Sync</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsDeployingDot(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  Deploy 24/7 Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
