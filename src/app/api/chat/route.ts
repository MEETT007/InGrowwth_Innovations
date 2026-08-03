import { NextResponse } from 'next/server';
import { LangGraphOrchestrator } from '../../../../igg-ai/runtime/source/orchestration/LangGraphOrchestrator';

// Instantiate the orchestrator once per server lifecycle
const orchestrator = new LangGraphOrchestrator();

export async function POST(req: Request) {
  try {
    const { sessionId, query } = await req.json();

    if (!sessionId || !query) {
      return NextResponse.json({ error: 'sessionId and query are required' }, { status: 400 });
    }

    const response = await orchestrator.run(sessionId, query);

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
