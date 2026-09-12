import { NextResponse } from 'next/server';

/* AI Chat API route commented out
import { LangGraphOrchestrator } from '../../../../igg-ai/runtime/source/orchestration/LangGraphOrchestrator';
import { db as prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const orchestrator = new LangGraphOrchestrator();
*/

export async function GET() {
  return NextResponse.json({ message: 'AI Chat API disabled' }, { status: 503 });
}

export async function POST() {
  return NextResponse.json({ message: 'AI Chat API disabled' }, { status: 503 });
}
