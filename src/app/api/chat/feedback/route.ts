import { NextResponse } from 'next/server';
import { UserLearningStore } from '@/lib/user-learning';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    let currentUserId = 'default-user';
    try {
      const authResult = await auth();
      if (authResult?.userId) {
        currentUserId = authResult.userId;
      }
    } catch {
      // In guest or local dev mode
    }

    const body = await req.json();
    const { action, rating, query, reason, userId, preferences } = body;
    const targetUserId = userId || currentUserId;

    // Action 1: Clear Memory
    if (action === 'clear-memory') {
      const updated = UserLearningStore.clearLearnings(targetUserId);
      return NextResponse.json({ success: true, profile: updated });
    }

    // Action 2: Update Personalization Preferences
    if (action === 'update-preferences' && preferences) {
      const updated = UserLearningStore.update(targetUserId, preferences);
      return NextResponse.json({ success: true, profile: updated });
    }

    // Action 3: Record Feedback (RLHF Learning)
    if (rating && query) {
      const updated = UserLearningStore.recordFeedback(
        targetUserId,
        rating,
        query,
        reason
      );
      return NextResponse.json({
        success: true,
        message: rating === 'POSITIVE'
          ? 'Positive feedback recorded. AI learned your preferred response format.'
          : 'Negative feedback recorded. AI learned your constraints to improve future responses.',
        learnedPreferences: updated.learnedPreferences,
      });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error('[API/Chat/Feedback] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    let currentUserId = 'default-user';
    try {
      const authResult = await auth();
      if (authResult?.userId) {
        currentUserId = authResult.userId;
      }
    } catch {}

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || currentUserId;

    const profile = UserLearningStore.get(userId);
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
