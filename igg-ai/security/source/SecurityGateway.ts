import { AuditLogger } from './AuditLogger';
import { PromptInjectionDetector } from './validators/PromptInjectionDetector';
import { PiiRedactor } from './validators/PiiRedactor';
import { RateLimiter } from './validators/RateLimiter';
import { QuotaManager } from './validators/QuotaManager';
import { FileValidator, FileData } from './validators/FileValidator';
import { MalwareScanner } from './validators/MalwareScanner';

export interface SecurityContext {
  identifier: string;
  ipAddress?: string;
  userId?: string;
}

export class SecurityGateway {
  private auditLogger = new AuditLogger();
  private promptDetector = new PromptInjectionDetector();
  private piiRedactor = new PiiRedactor();
  private rateLimiter = new RateLimiter();
  private quotaManager = new QuotaManager();
  private fileValidator = new FileValidator();
  private malwareScanner = new MalwareScanner();

  /**
   * Processes an incoming text request.
   * Applies rate limits, quotas, prompt injection checks, and PII redaction.
   */
  public async processTextRequest(input: string, context: SecurityContext): Promise<string> {
    try {
      this.rateLimiter.checkLimit(context.identifier);
      await this.quotaManager.checkAndIncrementQuota(context.identifier);

      if (this.promptDetector.detect(input)) {
        await this.auditLogger.logEvent(
          'PROMPT_INJECTION_DETECTED',
          'CRITICAL',
          { inputPreview: input.substring(0, 100) },
          undefined,
          context.userId,
          context.ipAddress
        );
        throw new Error('Security Violation: Malicious input detected.');
      }

      // Safe to process, apply redaction
      const cleanInput = this.piiRedactor.redact(input);
      return cleanInput;
    } catch (e: any) {
      // Re-throw security errors so the API layer can return a 403/429
      throw e;
    }
  }

  /**
   * Validates an uploaded file before processing it in Phase 8 pipelines.
   */
  public async processFileUpload(file: FileData, context: SecurityContext): Promise<boolean> {
    try {
      this.fileValidator.validate(file);

      const isClean = await this.malwareScanner.scan(file);
      if (!isClean) {
        await this.auditLogger.logEvent(
          'MALWARE_DETECTED',
          'CRITICAL',
          { filename: file.name, size: file.size },
          undefined,
          context.userId,
          context.ipAddress
        );
        throw new Error('Security Violation: File failed malware scan.');
      }

      return true;
    } catch (e: any) {
      await this.auditLogger.logEvent(
        'FILE_UPLOAD_REJECTED',
        'WARNING',
        { filename: file.name, error: e.message },
        undefined,
        context.userId,
        context.ipAddress
      );
      throw e;
    }
  }
}

export const securityGateway = new SecurityGateway();
