import { expect, test, describe, vi } from 'vitest';
import { consultantEngine } from '../source/ConsultantEngine';
import { retrievalEngine } from '../../rag/source/RetrievalEngine';
import { modelManager } from '../../core/source/managers/ModelManager';

describe('Consultant Reasoning Engine', () => {
  test('should process consultation request, invoke rules, retrieve knowledge, and generate structured response', async () => {
    
    // Mock Retrieval
    vi.spyOn(retrievalEngine, 'search').mockResolvedValue({
      originalQuery: "I need an ERP",
      statistics: {},
      finalPackage: {
        citations: ["[ERP Guide](/erp)"],
        contentChunks: ["We build custom ERP systems."]
      }
    });

    // Mock LLM
    const mockProvider = {
      name: "MockLLM",
      isConfigured: () => true,
      generateCompletion: vi.fn().mockResolvedValue({ text: "Here is your custom ERP solution based on our knowledge." }),
      generateEmbeddings: vi.fn(),
      getProviderName: () => "mock"
    };
    vi.spyOn(modelManager, 'getActiveLLMProvider').mockReturnValue(mockProvider as any);

    const rco = await consultantEngine.process("session-123", "I need an ERP for my business");
    
    // 1. Classifier should detect consultation intent
    expect(rco.intent.primary).toBe("consultation_request");
    
    // 2. Business rules should enforce consultative tone and suggest a workshop
    expect(rco.constraints.tone).toBe("consultative");
    expect(rco.businessContext.recommendedServices).toContain("Discovery Workshop");
    
    // 3. Retrieval knowledge should be bridged
    expect(rco.knowledge.documents).toContain("We build custom ERP systems.");
    
    // 4. PromptBuilder should have built the system prompt
    expect(rco.generation.systemPrompt).toContain("Tone: consultative");
    expect(rco.generation.systemPrompt).toContain("We build custom ERP systems.");
    
    // 5. LLM should be invoked and response validated
    expect(rco.generation.llmResponse).toBe("Here is your custom ERP solution based on our knowledge.");
    expect(rco.generation.isValid).toBe(true);

    // 6. CTA Generator should inject the discovery call
    expect(rco.generation.cta).toContain("15-minute discovery call");
  });
});
