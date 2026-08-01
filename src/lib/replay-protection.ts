import { db } from '@/lib/db';

const IDEMPOTENCY_KEY_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Atomically reserves a client-provided idempotency key. A unique database index
 * makes a duplicate request safe even when two server instances receive it at once.
 */
export async function claimIdempotencyKey(scope: string, key: string): Promise<boolean> {
  try {
    await db.idempotencyKey.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - IDEMPOTENCY_KEY_TTL_MS) } },
    });
    await db.idempotencyKey.create({ data: { scope, key } });
    return true;
  } catch (error) {
    if ((error as { code?: string }).code === 'P2002') return false;
    throw error;
  }
}
