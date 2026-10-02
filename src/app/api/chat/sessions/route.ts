import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// In-memory session store fallback
interface SessionMetadata {
  id: string;
  title: string;
  timestamp: string;
  userId: string;
  projectId?: string;
  folderId?: string | null;
  updatedAt: number;
}

const memorySessionStore = new Map<string, SessionMetadata[]>();

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

    // 1. Try fetching from Database
    try {
      const userFilter = userId
        ? {
            OR: [
              { userId },
              { userId: 'default-user' },
              { userId: 'guest-user' },
              { userId: null },
            ],
          }
        : {};

      const dbSessions = await prisma.aiSession.findMany({
        where: userFilter,
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'asc' },
            select: { content: true },
          },
        },
      });

      if (dbSessions.length > 0) {
        const formatted = dbSessions.map((s) => {
          const firstQuery = s.messages[0]?.content || '';
          const title = firstQuery.slice(0, 40) || 'Architecture Consultation';
          return {
            id: s.sessionId,
            title: title.length >= 40 ? `${title}...` : title,
            timestamp: new Date(s.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            }),
            updatedAt: new Date(s.updatedAt).getTime(),
          };
        });
        return NextResponse.json(formatted);
      }
    } catch {
      // Fallback to memory store if DB is offline
    }

    // 2. Return memory store sessions (combining user and guest sessions)
    const specificSessions = memorySessionStore.get(userId) || [];
    const guestSessions = memorySessionStore.get('guest-user') || [];
    const defaultSessions = memorySessionStore.get('default-user') || [];

    const mergedMap = new Map<string, SessionMetadata>();
    [...defaultSessions, ...guestSessions, ...specificSessions].forEach((s) => {
      mergedMap.set(s.id, s);
    });

    const sessions = Array.from(mergedMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);

    return NextResponse.json(
      sessions.map((s) => ({
        id: s.id,
        title: s.title,
        timestamp: s.timestamp,
        projectId: s.projectId,
        folderId: s.folderId,
        updatedAt: s.updatedAt,
      }))
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let currentUserId = 'default-user';
    try {
      const authResult = await auth();
      if (authResult?.userId) currentUserId = authResult.userId;
    } catch {}

    const body = await req.json();
    const { sessionId, title, userId, projectId, folderId } = body;
    const targetUserId = userId || currentUserId;

    if (!sessionId || !title) {
      return NextResponse.json({ error: 'sessionId and title required' }, { status: 400 });
    }

    // Update in-memory session index
    const userSessions = memorySessionStore.get(targetUserId) || [];
    const existingIdx = userSessions.findIndex((s) => s.id === sessionId);

    if (existingIdx >= 0) {
      userSessions[existingIdx].title = title;
      if (projectId) userSessions[existingIdx].projectId = projectId;
      if (folderId !== undefined) userSessions[existingIdx].folderId = folderId;
      userSessions[existingIdx].updatedAt = Date.now();
    } else {
      userSessions.unshift({
        id: sessionId,
        title,
        timestamp: 'Just now',
        userId: targetUserId,
        projectId: projectId || 'proj-default',
        folderId: folderId || null,
        updatedAt: Date.now(),
      });
    }

    memorySessionStore.set(targetUserId, userSessions);
    // Also save in guest-user map for cross-compatibility
    memorySessionStore.set('guest-user', userSessions);

    // Also attempt DB upsert
    try {
      await prisma.aiSession.upsert({
        where: { sessionId },
        update: { updatedAt: new Date() },
        create: { sessionId, userId: targetUserId },
      });
    } catch {}

    return NextResponse.json({ success: true, sessions: userSessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    let currentUserId = 'default-user';
    try {
      const authResult = await auth();
      if (authResult?.userId) currentUserId = authResult.userId;
    } catch {}

    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId');
    const clearAll = url.searchParams.get('clearAll') === 'true';
    const userId = url.searchParams.get('userId') || currentUserId;

    if (clearAll) {
      memorySessionStore.delete(userId);
      memorySessionStore.delete('guest-user');
      memorySessionStore.delete('default-user');
      try {
        await prisma.aiSession.deleteMany({ where: { userId } });
      } catch {}
      return NextResponse.json({ success: true, message: 'All chat history cleared' });
    }

    if (sessionId) {
      [userId, 'guest-user', 'default-user'].forEach((key) => {
        const list = memorySessionStore.get(key) || [];
        memorySessionStore.set(key, list.filter((s) => s.id !== sessionId));
      });

      try {
        await prisma.aiSession.delete({ where: { sessionId } });
      } catch {}
      return NextResponse.json({ success: true, message: 'Session deleted' });
    }

    return NextResponse.json({ error: 'sessionId or clearAll required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
