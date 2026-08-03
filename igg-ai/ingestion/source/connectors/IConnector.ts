export interface RawDocument {
  id: string;
  sourceId: string;
  content: string; // HTML, Markdown, Text
  rawMetadata: Record<string, any>;
  hash: string;
}

export interface IConnectorConfig {
  sourceId: string;
  type: string;
  params: Record<string, any>;
}

export interface IConnector {
  config: IConnectorConfig;
  
  // Discover documents that need syncing
  discover(): AsyncGenerator<RawDocument>;
  
  // Fetch specific document content
  fetch(docId: string): Promise<RawDocument>;
  
  // Validate connector configuration
  validate(): Promise<boolean>;
}
