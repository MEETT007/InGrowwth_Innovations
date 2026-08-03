import { expect, test, describe, vi } from 'vitest';
import { retrievalEngine } from '../source/RetrievalEngine';
import { knowledgeManager } from '../../core/source/managers/KnowledgeManager';

describe('Retrieval Intelligence Pipeline', () => {
  test('should process query, retrieve, rank, and build context package', async () => {
    
    // Mock the knowledgeManager search to return dense stub results
    vi.spyOn(knowledgeManager, 'search').mockResolvedValue([
      { id: 'chunk1', score: 0.9, metadata: { title: "Pricing Page", url: "/pricing", contentHash: "hash1", text: "Cost is $50" } },
      { id: 'chunk2', score: 0.8, metadata: { title: "Duplicate Pricing", url: "/pricing", contentHash: "hash1", text: "Cost is $50" } },
      { id: 'chunk3', score: 0.5, metadata: { title: "About Us", url: "/about", contentHash: "hash3", text: "We build AI" } },
    ]);

    const context = await retrievalEngine.search("What is your pricing?");
    
    // 1. Intent Analyzer should flag pricing
    expect(context.intent).toBe("pricing");
    
    // 2. Query Processor should remove stop words like "what is your"
    expect(context.processedQuery).not.toContain("what");
    
    // 3. Metadata Filter should lock category to pricing
    expect(context.metadataFilters?.category).toBe("pricing");
    
    // 4. Duplicate removal should drop chunk2 since it shares hash1
    expect(context.compressedResults?.length).toBe(2);
    
    // 5. Citations should be built in markdown
    expect(context.citations).toContain("[Pricing Page](/pricing)");
    
    // 6. Final package should exist
    expect(context.finalPackage).toBeDefined();
    expect(context.finalPackage?.contentChunks).toContain("Cost is $50");
  });
});
