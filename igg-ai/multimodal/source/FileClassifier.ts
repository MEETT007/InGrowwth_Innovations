import { FileData } from '../../security/source/validators/FileValidator';

export type FileType = 'DOCUMENT' | 'VISION' | 'AUDIO' | 'VIDEO' | 'UNKNOWN';

export class FileClassifier {
  /**
   * Classifies an incoming file based on MIME type to route it to the correct engine.
   */
  public classify(file: FileData): FileType {
    if (file.mimeType.startsWith('image/')) {
      return 'VISION';
    }

    if (file.mimeType === 'application/pdf' || file.mimeType.startsWith('text/')) {
      return 'DOCUMENT';
    }

    if (file.mimeType.startsWith('audio/')) {
      return 'AUDIO';
    }

    if (file.mimeType.startsWith('video/')) {
      return 'VIDEO';
    }

    return 'UNKNOWN';
  }
}
