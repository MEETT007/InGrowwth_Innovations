import { db } from '../../../src/lib/db';

export class AuditLogger {
  /**
   * Logs a security event to the database.
   */
  public async logEvent(
    action: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    details: any,
    resourceId?: string,
    userId?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      await db.auditLog.create({
        data: {
          action,
          severity,
          details,
          resourceId,
          userId,
          ipAddress,
        },
      });

      // Also log to console for development visibility
      if (severity === 'CRITICAL') {
        console.error(`[SECURITY CRITICAL] ${action}:`, details);
      } else {
        console.warn(`[SECURITY ${severity}] ${action}`);
      }
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }
  }
}
