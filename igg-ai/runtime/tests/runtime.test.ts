import { expect, test, describe, vi } from 'vitest';
import { aiRuntime } from '../source/AIRuntime';
import { toolRegistry } from '../source/registries/ToolRegistry';
import { globalCapabilityRegistry, Capability } from '../source/registries/CapabilityRegistry';

// Mock dependencies
import { consultantEngine } from '../../consultant/source/ConsultantEngine';
import { retrievalEngine } from '../../rag/source/RetrievalEngine';

describe('AI Runtime & Agent Orchestration', () => {
  test('should register tools, expose capabilities, and execute the LangGraph orchestrator', async () => {
    
    // Mock Retrieval Engine to avoid needing real embedding providers in unit tests
    vi.spyOn(retrievalEngine, 'search').mockResolvedValue({
      originalQuery: "Find me portfolio items",
      statistics: {},
      finalPackage: {
        citations: ["[Portfolio](/portfolio)"],
        contentChunks: ["Here is our portfolio."]
      }
    } as any);
    
    // 1. Verify Registries
    const tools = toolRegistry.getAll();
    expect(tools.length).toBeGreaterThan(0);
    expect(tools.find(t => t.name === "search_website")).toBeDefined();
    
    expect(globalCapabilityRegistry.has(Capability.KNOWLEDGE_SEARCH)).toBe(true);

    // 2. Mock Phase 5 Consultant
    vi.spyOn(consultantEngine, 'process').mockResolvedValue({
      generation: {
        llmResponse: "Here is your LangGraph orchestrated response."
      }
    } as any);

    // 3. Execute Runtime Chat (which runs LangGraph)
    const response = await aiRuntime.chat("session-abc", "Find me portfolio items");
    
    expect(response).toBe("Here is your LangGraph orchestrated response.");
  });
});
