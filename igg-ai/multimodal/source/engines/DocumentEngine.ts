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
        return this.cleanAndFormatMarkdown(data.text, file.name);
      }

      if (file.mimeType.startsWith('text/')) {
        const text = file.buffer.toString('utf-8');
        return this.cleanAndFormatMarkdown(text, file.name);
      }

      throw new Error(`Unsupported document type: ${file.mimeType}`);
    } catch (error: unknown) {
      const err = error as Error;
      Logger.error(`[DocumentEngine] Failed to parse ${file.name}: ${err.message}`);
      throw new Error(`Document parsing failed: ${err.message}`);
    }
  }

  /**
   * Transforms raw extracted text from PDFs and documents into structured,
   * token-optimized Markdown. Strips repetitive page headers, footers,
   * excessive whitespace, and organizes sections into clean markdown hierarchy.
   */
  public cleanAndFormatMarkdown(rawText: string, filename?: string): string {
    if (!rawText || rawText.trim().length === 0) return '';

    let text = rawText;

    // 1. Reassemble hyphenated line breaks from PDF columns (e.g. "architec-\nture" -> "architecture")
    text = text.replace(/(\w+)-\n\s*(\w+)/g, '$1$2');

    // 2. Remove repetitive PDF page numbers and pagination artifacts (e.g., "Page 1 of 12", "Page 3", "- 4 -")
    text = text.replace(/^\s*(?:page\s*\d+\s*(?:of|\/)\s*\d+|\bpage\s*\d+\b|\-?\s*\d+\s*\-?)\s*$/gim, '');

    // 3. Remove common repetitive watermarks / boilerplate headers
    text = text.replace(/^\s*(?:confidential|draft|internal use only|all rights reserved)\s*$/gim, '');

    // 4. Normalize non-standard bullet characters to standard markdown bullets
    text = text.replace(/^[\s\t]*[•●▪◆◦*]\s*/gm, '- ');

    // 5. Detect all-caps or numbered headings and convert them to clean Markdown headings
    text = text.replace(/^(\d+\.[\d.]*\s+[A-Z][A-Za-z0-9\s:_-]{3,60})$/gm, '### $1');
    text = text.replace(/^([A-Z\s]{4,40}:?)$/gm, (match) => {
      const trimmed = match.trim();
      if (['AND', 'OR', 'NOT', 'FOR', 'WITH', 'IN'].includes(trimmed)) return match;
      return `\n## ${trimmed.charAt(0)}${trimmed.slice(1).toLowerCase()}\n`;
    });

    // 6. Normalize multiple consecutive blank lines to at most two
    text = text.replace(/\n{3,}/g, '\n\n');

    // 7. Compact excess inline spaces
    text = text.replace(/[ \t]{2,}/g, ' ');

    const titleHeader = filename ? `### Document Context: ${filename}\n\n` : '';
    return `${titleHeader}${text.trim()}`;
  }
}
