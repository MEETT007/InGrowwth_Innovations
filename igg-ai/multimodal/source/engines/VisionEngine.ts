import { FileData } from '../../../security/source/validators/FileValidator';
import { Logger } from '../../../core/source/utils/Logger';

export class VisionEngine {
  /**
   * Parses structures and text out of an Image using Ollama (LLaVA).
   */
  public async extract(file: FileData): Promise<string> {
    Logger.info(`[VisionEngine] Analyzing image ${file.name}`);

    try {
      const base64Image = file.buffer.toString('base64');

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llava',
          prompt:
            'Analyze this image and describe the UI layout, components, and text visible in detail.',
          images: [base64Image],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error: any) {
      Logger.warn(
        `[VisionEngine] LLaVA failed or not running. Fallback activated. Error: ${error.message}`
      );
      return `[Vision Analysis Fallback]: Uploaded image ${file.name} could not be processed because the local Vision Model is offline.`;
    }
  }
}
