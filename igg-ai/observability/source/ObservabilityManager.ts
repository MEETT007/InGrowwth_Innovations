import { db } from '../../../src/lib/db';
import { ReasoningContextObject } from '../../consultant/source/models/ReasoningContextObject';

export class ObservabilityManager {
  private static instance: ObservabilityManager;

  private constructor() {}

  public static getInstance(): ObservabilityManager {
    if (!ObservabilityManager.instance) {
      ObservabilityManager.instance = new ObservabilityManager();
    }
    return ObservabilityManager.instance;
  }

  /**
   * Tracks a complete AI execution lifecycle
   */
  async startTrace(sessionId: string, query: string): Promise<string> {
    try {
      const session = await db.aiSession.upsert({
        where: { sessionId },
        update: {},
        create: { sessionId },
      });

      const trace = await db.aiTrace.create({
        data: {
          sessionId: session.sessionId,
          query,
          status: 'RUNNING',
        },
      });
      return trace.id;
    } catch (error) {
      console.error('[Observability] Failed to start trace', error);
      return 'trace-error';
    }
  }

  /**
   * Finds the currently active trace for a given session
   */
  async findActiveTrace(sessionId: string): Promise<string | null> {
    try {
      const trace = await db.aiTrace.findFirst({
        where: { sessionId, status: 'RUNNING' },
        orderBy: { createdAt: 'desc' },
      });
      return trace ? trace.id : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Logs an event for a specific stage in the pipeline
   */
  async logEvent(
    traceId: string,
    stageName: string,
    latencyMs: number,
    rcoSnapshot: ReasoningContextObject | any
  ) {
    if (traceId === 'trace-error') return;

    try {
      await db.aiEvent.create({
        data: {
          traceId,
          stageName,
          latency: latencyMs,
          rcoSnapshot: JSON.parse(JSON.stringify(rcoSnapshot)), // Deep clone to avoid mutations
        },
      });
    } catch (error) {
      console.error(`[Observability] Failed to log event for stage ${stageName}`, error);
    }
  }

  /**
   * Completes a trace
   */
  async endTrace(
    traceId: string,
    response: string,
    totalLatency: number,
    isError: boolean = false,
    errorMsg?: string
  ) {
    if (traceId === 'trace-error') return;

    try {
      await db.aiTrace.update({
        where: { id: traceId },
        data: {
          response,
          latency: totalLatency,
          status: isError ? 'FAILED' : 'SUCCESS',
          error: errorMsg,
        },
      });
    } catch (error) {
      console.error('[Observability] Failed to end trace', error);
    }
  }
}

export const observabilityManager = ObservabilityManager.getInstance();
