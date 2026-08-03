export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  providerSpecific?: Record<string, any>;
}

export interface ILLMProvider {
  name: string;
  generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  streamText(prompt: string, options?: GenerationOptions): AsyncGenerator<string>;
  healthCheck(): Promise<boolean>;
}
