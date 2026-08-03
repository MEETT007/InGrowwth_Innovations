export interface IVisionProvider {
  name: string;
  analyzeImage(imageBuffer: Buffer, prompt?: string): Promise<string>;
  healthCheck(): Promise<boolean>;
}
