type RateLimitRecord = {
  timestamps: number[];
};

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up memory cache periodically (every 10 minutes) to avoid memory leaks
if (globalThis && !(globalThis as unknown as Record<string, unknown>).rateLimitIntervalSet) {
  (globalThis as unknown as Record<string, unknown>).rateLimitIntervalSet = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      // Filter out timestamps older than 10 minutes
      const activeTimestamps = value.timestamps.filter((t) => now - t < 600000);
      if (activeTimestamps.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: activeTimestamps });
      }
    }
  }, 600000);
}

/**
 * Checks if a given IP has exceeded the limit in the window.
 * @param ip Client IP address
 * @param limit Max number of requests allowed in the window
 * @param windowMs Window duration in milliseconds (default: 60000ms / 1 minute)
 * @returns Object indicating if the request is allowed, remaining requests, and reset time
 */
export async function rateLimit(
  ip: string,
  limit: number,
  windowMs: number = 60000
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  const key = `${ip}`;

  let record = rateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetTime = oldestTimestamp + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
    };
  }

  // Record current request timestamp
  record.timestamps.push(now);
  rateLimitMap.set(key, record);

  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    reset: now + windowMs,
  };
}
