import { FileData } from '../../../security/source/validators/FileValidator';
import { Logger } from '../../../core/source/utils/Logger';

export class DocumentEngine {
  /**
   * Parses text and structure out of a Document (PDF, DOCX, Markdown).
   */
  public async extract(file: FileData): Promise<string> {
    Logger.info(`[DocumentEngine] Extracting text from ${file.name}`);

    try {
      if (file.mimeType === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Lazy load pdf-parse to avoid Next.js build-time ReferenceError: DOMMatrix is not defined
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(file.buffer);
        return data.text;
      }

      if (file.mimeType.startsWith('text/')) {
        return file.buffer.toString('utf-8');
      }

      throw new Error(`Unsupported document type: ${file.mimeType}`);
    } catch (error: unknown) {
      const err = error as Error;
      Logger.error(`[DocumentEngine] Failed to parse ${file.name}: ${err.message}`);
      throw new Error(`Document parsing failed: ${err.message}`);
    }
  }
}
