import { IConnector, IConnectorConfig, RawDocument } from "./IConnector";
import crypto from "crypto";

export class MarkdownConnector implements IConnector {
  config: IConnectorConfig;

  constructor(config: IConnectorConfig) {
    this.config = config;
  }

  async validate(): Promise<boolean> {
    if (!this.config.params.directoryPath) return false;
    return true;
  }

  async *discover(): AsyncGenerator<RawDocument> {
    // Stub: In reality this would read local or remote markdown files
    const stubMd = `# Document\n\nThis is a mock markdown file.`;
    const hash = crypto.createHash("sha256").update(stubMd).digest("hex");
    
    yield {
      id: `${this.config.sourceId}_doc_1`,
      sourceId: this.config.sourceId,
      content: stubMd,
      rawMetadata: { filename: "doc.md" },
      hash
    };
  }

  async fetch(docId: string): Promise<RawDocument> {
    return (await this.discover().next()).value;
  }
}
