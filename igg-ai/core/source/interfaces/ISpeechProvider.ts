export interface ISpeechProvider {
  name: string;
  speechToText(audioBuffer: Buffer): Promise<string>;
  textToSpeech(text: string): Promise<Buffer>;
  healthCheck(): Promise<boolean>;
}
