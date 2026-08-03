import { IConnector, IConnectorConfig, RawDocument } from "./IConnector";
import crypto from "crypto";

export class WebsiteConnector implements IConnector {
  config: IConnectorConfig;

  constructor(config: IConnectorConfig) {
    this.config = config;
  }

  async validate(): Promise<boolean> {
    if (!this.config.params.startUrl) return false;
    return true;
  }

  async *discover(): AsyncGenerator<RawDocument> {
    // Stub: In reality this would crawl the sitemap or recursively fetch pages
    const stubHtml = `<html><head><title>Mock Page</title></head><body><h1>Hello</h1><p>Test content</p></body></html>`;
    const hash = crypto.createHash("sha256").update(stubHtml).digest("hex");
    
    yield {
      id: `${this.config.sourceId}_page_1`,
      sourceId: this.config.sourceId,
      content: stubHtml,
      rawMetadata: { title: "Mock Page", url: this.config.params.startUrl },
      hash
    };
  }

  async fetch(docId: string): Promise<RawDocument> {
    // Stub
    return (await this.discover().next()).value;
  }
}
