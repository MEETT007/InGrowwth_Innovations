import { Logger } from '../../../core/source/utils/Logger';

// In a real production system, this would be backed by Redis via ioredis or @upstash/redis.
// For the v1.0 fallback, we use an in-memory map.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class RateLimiter {
  private readonly WINDOW_MS = 60000; // 1 minute
  private readonly MAX_REQUESTS = 50;

  /**
   * Checks if the identifier has exceeded the rate limit.
   * Throws an Error if limited.
   */
  public checkLimit(identifier: string): void {
    const now = Date.now();
    let record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + this.WINDOW_MS };
    }

    record.count++;
    rateLimitStore.set(identifier, record);

    if (record.count > this.MAX_REQUESTS) {
      Logger.warn(`Rate limit exceeded for identifier: ${identifier}`, {
        identifier,
        count: record.count,
      });
      throw new Error(`Rate limit exceeded for ${identifier}. Please wait 60 seconds.`);
    }
  }
}
