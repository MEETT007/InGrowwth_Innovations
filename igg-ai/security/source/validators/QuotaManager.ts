import { db } from '../../../../src/lib/db';

export class QuotaManager {
  /**
   * Checks and increments API quota usage for a session or user.
   */
  public async checkAndIncrementQuota(
    identifier: string,
    tokensEstimated: number = 0
  ): Promise<void> {
    const now = new Date();

    // Upsert the quota record
    const record = await db.apiQuota.upsert({
      where: { identifier },
      update: {
        requestsCount: { increment: 1 },
        tokensUsed: { increment: tokensEstimated },
      },
      create: {
        identifier,
        requestsCount: 1,
        tokensUsed: tokensEstimated,
        resetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1), // Reset start of next month
      },
    });

    // Reset logic if we've passed the reset date
    if (now > record.resetAt) {
      await db.apiQuota.update({
        where: { identifier },
        data: {
          requestsCount: 1,
          tokensUsed: tokensEstimated,
          resetAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      });
      return;
    }

    if (record.requestsCount > record.limitRequests || record.tokensUsed > record.limitTokens) {
      throw new Error(
        `Quota exceeded for ${identifier}. Please upgrade your plan or wait for the reset.`
      );
    }
  }
}
