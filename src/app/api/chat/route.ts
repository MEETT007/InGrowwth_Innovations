import { NextResponse } from 'next/server';
import { LangGraphOrchestrator } from '../../../../igg-ai/runtime/source/orchestration/LangGraphOrchestrator';
import { db as prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Instantiate the orchestrator once per server lifecycle
const orchestrator = new LangGraphOrchestrator();

// Get chat history for a session
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Verify session belongs to user (optional but recommended)
    const session = await prisma.aiSession.findUnique({ where: { sessionId } });
    if (session && session.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.aiChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sessionId, query } = await req.json();

    if (!sessionId || !query) {
      return NextResponse.json({ error: 'sessionId and query are required' }, { status: 400 });
    }

    // Ensure session exists
    await prisma.aiSession.upsert({
      where: { sessionId },
      update: {},
      create: { sessionId, userId },
    });

    // Save user message
    await prisma.aiChatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: query,
      },
    });

    const response = await orchestrator.run(sessionId, query);

    // Save assistant message
    await prisma.aiChatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: response.text || '',
        interactiveData: response.requiresHandoff
          ? { type: 'HANDOFF', reason: response.handoffReason }
          : undefined,
      },
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API/Chat] Error:', err.message);
    return NextResponse.json(
      { error: 'Failed to process request', details: err.message },
      { status: 500 }
    );
  }
}
