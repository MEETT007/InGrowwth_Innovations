import { LangGraphOrchestrator } from './orchestration/LangGraphOrchestrator';
import { toolRegistry } from './registries/ToolRegistry';
import { SearchWebsiteTool } from './tools/SearchWebsiteTool';
import { globalCapabilityRegistry, Capability } from './registries/CapabilityRegistry';

export class AIRuntime {
  private orchestrator: LangGraphOrchestrator;

  constructor() {
    this.bootstrap();
    this.orchestrator = new LangGraphOrchestrator();
  }

  private bootstrap() {
    // Enable capabilities
    globalCapabilityRegistry.enable(Capability.KNOWLEDGE_SEARCH);

    // Register Tools
    toolRegistry.register(new SearchWebsiteTool());
  }

  async chat(sessionId: string, message: string): Promise<string> {
    // The Runtime accepts the raw request and hands it to LangGraph
    const response = await this.orchestrator.run(sessionId, message);
    return response.text;
  }
}

export const aiRuntime = new AIRuntime();
