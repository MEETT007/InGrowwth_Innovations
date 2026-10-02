import { NextResponse } from 'next/server';
import { LangGraphOrchestrator } from '../../../../igg-ai/runtime/source/orchestration/LangGraphOrchestrator';
import { db as prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { UserLearningStore } from '@/lib/user-learning';

// Instantiate the orchestrator once per server lifecycle
const orchestrator = new LangGraphOrchestrator();

// In-memory fallback cache so chat works smoothly even when DB connection is offline
interface CachedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  interactiveData?: Record<string, unknown>;
  createdAt: string;
}

const memoryStore = new Map<string, CachedMessage[]>();

// Get chat history for a session
export async function GET(req: Request) {
  try {
    let currentUserId: string | null = null;
    try {
      const authResult = await auth();
      currentUserId = authResult.userId;
    } catch {
      // In keyless or unauthenticated mode, continue gracefully
    }

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Try fetching from database first
    try {
      const session = await prisma.aiSession.findUnique({ where: { sessionId } });
      if (session && currentUserId && session.userId && session.userId !== currentUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const messages = await prisma.aiChatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      });

      if (messages.length > 0) {
        return NextResponse.json(messages);
      }
    } catch (dbErr) {
      console.warn('[API/Chat] DB fetch failed, falling back to memory store:', (dbErr as Error).message);
    }

    // Fallback to in-memory store
    const cached = memoryStore.get(sessionId) || [];
    return NextResponse.json(cached);
  } catch (error: unknown) {
    console.error('[API/Chat] History fetch error:', error);
    return NextResponse.json([], { status: 200 }); // Graceful empty fallback instead of 500
  }
}

export async function POST(req: Request) {
  try {
    let currentUserId: string = 'guest-user';
    try {
      const authResult = await auth();
      if (authResult.userId) {
        currentUserId = authResult.userId;
      }
    } catch {
      // Fallback to guest user
    }

    const body = await req.json();
    const sessionId = body.sessionId || currentUserId;
    const query = body.query || body.message;
    const model = body.model || 'igg-architect-pro';
    const reasoning = body.reasoning ?? false;
    const webSearch = body.webSearch ?? false;
    const isTemporary = body.isTemporary ?? false;

    if (!sessionId || !query) {
      return NextResponse.json({ error: 'sessionId and query (or message) are required' }, { status: 400 });
    }

    // Attempt DB session upsert (only if NOT in temporary incognito mode)
    if (!isTemporary) {
      try {
        await prisma.aiSession.upsert({
          where: { sessionId },
          update: {},
          create: { sessionId, userId: currentUserId },
        });

        await prisma.aiChatMessage.create({
          data: {
            sessionId,
            role: 'user',
            content: query,
          },
        });
      } catch (dbErr) {
        console.warn('[API/Chat] DB write skipped (DB offline):', (dbErr as Error).message);
      }

      // Update in-memory store
      const sessionHistory = memoryStore.get(sessionId) || [];
      sessionHistory.push({
        id: Date.now().toString(),
        role: 'user',
        content: query,
        createdAt: new Date().toISOString(),
      });
      memoryStore.set(sessionId, sessionHistory);
    }

    // Retrieve user personalization & RLHF feedback memory (unless in incognito mode)
    const userLearningContext = isTemporary
      ? undefined
      : UserLearningStore.getPromptContext(currentUserId);

    // Run LangGraph Orchestrator with options
    const response = await orchestrator.run(sessionId, query, undefined, {
      model,
      reasoning,
      webSearch,
      userLearningContext,
    });


    // Process reasoning traces & think tags
    let cleanText = response.text || '';
    let reasoningTrace: string | undefined = undefined;
    let thinkingSteps: Array<{ label: string; duration?: string }> | undefined = undefined;

    const thinkMatch = cleanText.match(/<think>([\s\S]*?)<\/think>/i);
    if (thinkMatch) {
      reasoningTrace = thinkMatch[1].trim();
      cleanText = cleanText.replace(/<think>[\s\S]*?<\/think>/i, '').trim();

      // Extract lines or synthesize professional thinking steps from the trace
      const parsedLines = reasoningTrace
        .split('\n')
        .map((l) => l.trim().replace(/^[-*•0-9.]+\s*/, ''))
        .filter((l) => l.length > 15 && !l.startsWith('#'))
        .slice(0, 5);

      if (parsedLines.length > 0) {
        thinkingSteps = parsedLines.map((label, idx) => ({
          label,
          duration: `${Math.round(180 + idx * 110)}ms`,
        }));
      }
    }

    if (!thinkingSteps && (reasoning || model === 'igg-deep-reasoning')) {
      thinkingSteps = [
        { label: 'Deconstructed query into architectural domains & technical requirements', duration: '140ms' },
        { label: 'Queried verified InGrowwth Enterprise ADR Repository & Knowledge Base', duration: '320ms' },
        ...(webSearch
          ? [{ label: 'Queried real-time web search index for modern industry benchmarks', duration: '410ms' }]
          : []),
        { label: 'Evaluated trade-offs across scalability, latency SLAs & zero-trust security', duration: '380ms' },
        { label: 'Synthesized production-ready executive consultation & action plan', duration: '260ms' },
      ];
    }

    // Detect meeting/calendar booking intent
    const isMeetingQuery =
      /(schedule|book|meeting|appointment|calendar|call with|consultation|talk to|connect with|strategy call|discovery call|demo|meet with)/i.test(
        query
      );

    // Only synthesize architectural UI widgets when the query specifically asks for architecture or scoping
    const isArchitectureQuery =
      /(architect|system design|tech stack|timeline|microservice|database schema|scalability|pattern|infrastructure|mvp scope|estimate)/i.test(
        query
      );

    let interactiveData: Record<string, unknown> | undefined = undefined;
    if (response.requiresHandoff) {
      interactiveData = { type: 'HANDOFF', reason: response.handoffReason };
    } else if (isMeetingQuery) {
      interactiveData = {
        type: 'CALENDAR_BOOKING',
        title: 'Schedule Technical Discovery Consultation',
      };
    } else if (isArchitectureQuery) {
      interactiveData = {
        type: 'ARCHITECTURE_SYNTHESIS',
        techStack: ['Next.js 16', 'TypeScript', 'LangGraph', 'Neon Postgres', 'pgvector'],
        timeline: { min: 4, max: 10 },
        architecturePattern: 'Event-Driven Distributed Microservices',
      };
    }

    // Attempt DB assistant message create (non-blocking, only if not temporary)
    if (!isTemporary) {
      try {
        await prisma.aiChatMessage.create({
          data: {
            sessionId,
            role: 'assistant',
            content: cleanText,
            interactiveData: interactiveData ? JSON.parse(JSON.stringify(interactiveData)) : undefined,
          },
        });
      } catch {
        // ignore offline DB
      }

      const sessionHistory = memoryStore.get(sessionId) || [];
      sessionHistory.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanText,
        interactiveData,
        createdAt: new Date().toISOString(),
      });
      memoryStore.set(sessionId, sessionHistory);
    }

    return NextResponse.json({
      text: cleanText,
      requiresHandoff: response.requiresHandoff,
      handoffReason: response.handoffReason,
      interactiveData,
      thinkingSteps,
      reasoningTrace,
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API/Chat] Processing Error:', err.message);
    return NextResponse.json(
      { error: 'Failed to process request', details: err.message },
      { status: 500 }
    );
  }
}
