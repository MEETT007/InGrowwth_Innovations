import { expect, test, describe } from 'vitest';
import { processingPipeline } from '../source/pipeline/ProcessingPipeline';
import { RawDocument } from '../source/connectors/IConnector';

describe('Processing Pipeline', () => {
  test('should clean, chunk, and enrich a raw document', async () => {
    const raw: RawDocument = {
      id: 'doc-1',
      sourceId: 'web-1',
      content: '<html><body><h1>Welcome</h1><p>This is a test document that should be cleaned and chunked appropriately.</p></body></html>',
      rawMetadata: { title: 'Test Doc' },
      hash: 'abc'
    };

    const chunks = await processingPipeline.process(raw);
    
    // Expect at least 1 chunk
    expect(chunks.length).toBeGreaterThan(0);
    
    // HTML tags should be stripped (very basic strip in our stub)
    expect(chunks[0].text).not.toContain('<html>');
    
    // Metadata should be enriched
    expect(chunks[0].metadata.documentId).toBe('doc-1');
    expect(chunks[0].metadata.title).toBe('Test Doc');
    expect(chunks[0].metadata.contentHash).toBeDefined();
    expect(chunks[0].metadata.wordCount).toBeGreaterThan(0);
    expect(chunks[0].metadata.chunkNumber).toBe(1);
  });
});
