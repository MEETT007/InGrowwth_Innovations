export interface FileData {
  name: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export class FileValidator {
  private readonly MAX_SIZE_MB = 10;
  private readonly ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'text/plain',
    'text/markdown',
    'text/csv',
  ];

  /**
   * Validates file size and type.
   * Throws an error if invalid.
   */
  public validate(file: FileData): void {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > this.MAX_SIZE_MB) {
      throw new Error(`File size ${sizeInMB.toFixed(2)}MB exceeds limit of ${this.MAX_SIZE_MB}MB.`);
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      throw new Error(`File type ${file.mimeType} is not supported for AI processing.`);
    }

    // Advanced: In production, we would use a magic number library (like 'file-type')
    // to read the buffer headers and guarantee it's not a renamed .exe file.
  }
}
