import { StateGraph, START, END, MemorySaver } from '@langchain/langgraph';
import { toolRegistry } from '../registries/ToolRegistry';
import { consultantEngine } from '../../../consultant/source/ConsultantEngine';
import { observabilityManager } from '../../../observability/source/ObservabilityManager';
import { FileData } from '../../../security/source/validators/FileValidator';
import { securityGateway } from '../../../security/source/SecurityGateway';
import { FileClassifier } from '../../../multimodal/source/FileClassifier';
import { DocumentEngine } from '../../../multimodal/source/engines/DocumentEngine';
import { VisionEngine } from '../../../multimodal/source/engines/VisionEngine';
import { RequirementIntelligenceEngine } from '../../../multimodal/source/engines/RequirementIntelligenceEngine';

// Define the state shape for the LangGraph agent
interface AgentState {
  sessionId: string;
  query: string;
  uploadedFile?: FileData;
  plan: string;
  toolResults: Record<string, any>;
  requirementInsights?: any;
  finalResponse: string;
  requiresHandoff?: boolean;
  handoffReason?: string;
}

export class LangGraphOrchestrator {
  private workflow: any;
  private checkpointer: MemorySaver;

  private fileClassifier = new FileClassifier();
  private documentEngine = new DocumentEngine();
  private visionEngine = new VisionEngine();
  private requirementEngine = new RequirementIntelligenceEngine();

  constructor() {
    this.checkpointer = new MemorySaver();
    this.buildGraph();
  }

  private buildGraph() {
    const graph = new StateGraph<AgentState>({
      channels: {
        sessionId: { value: (x, y) => y ?? x, default: () => 'default' },
        query: { value: (x, y) => y ?? x, default: () => '' },
        uploadedFile: { value: (x, y) => y ?? x, default: () => undefined },
        plan: { value: (x, y) => y ?? x, default: () => '' },
        toolResults: {
          value: (x, y) => ({ ...x, ...y }),
          default: () => ({}),
        },
        requirementInsights: { value: (x, y) => y ?? x, default: () => undefined },
        finalResponse: { value: (x, y) => y ?? x, default: () => '' },
        requiresHandoff: { value: (x, y) => y ?? x, default: () => undefined },
        handoffReason: { value: (x, y) => y ?? x, default: () => undefined },
      },
    });

    // Node: File Processor (Phase 8)
    graph.addNode('file_processor', async (state) => {
      if (!state.uploadedFile) return {};

      const file = state.uploadedFile;
      const context = { identifier: state.sessionId };

      await securityGateway.processFileUpload(file, context);
      const fileType = this.fileClassifier.classify(file);

      let rawText = '';
      if (fileType === 'DOCUMENT') {
        rawText = await this.documentEngine.extract(file);
      } else if (fileType === 'VISION') {
        rawText = await this.visionEngine.extract(file);
      } else {
        rawText = `[Unsupported file type uploaded: ${file.name}]`;
      }

      const insights = await this.requirementEngine.analyze(rawText);
      return { requirementInsights: insights };
    });

    // Node: Planner
    graph.addNode('planner', async (state) => {
      return { plan: 'search_website' };
    });

    // Node: Executor
    graph.addNode('executor', async (state) => {
      const toolToRun = state.plan;
      const tool = toolRegistry.get(toolToRun);
      let result = null;
      if (tool) {
        result = await tool.execute({ query: state.query });
      }
      return { toolResults: { [toolToRun]: result } };
    });

    // Node: Consultant
    graph.addNode('consultant', async (state) => {
      let enhancedQuery = state.query;
      if (state.requirementInsights) {
        enhancedQuery += `\n\n[FILE REQUIREMENTS EXTRACTED]:\n${JSON.stringify(state.requirementInsights, null, 2)}`;
      }

      const rco = await consultantEngine.process(state.sessionId, enhancedQuery);
      return {
        finalResponse: rco.generation.llmResponse || 'No response generated.',
        requiresHandoff: rco.generation.requiresHandoff,
        handoffReason: rco.generation.handoffReason,
      };
    });

    // Edges
    (graph as any).addEdge(START, 'file_processor');
    (graph as any).addEdge('file_processor', 'planner');
    (graph as any).addEdge('planner', 'executor');
    (graph as any).addEdge('executor', 'consultant');
    (graph as any).addEdge('consultant', END);

    this.workflow = graph.compile({ checkpointer: this.checkpointer });
  }

  async run(
    sessionId: string,
    query: string,
    uploadedFile?: FileData
  ): Promise<{ text: string; requiresHandoff?: boolean; handoffReason?: string }> {
    const startTime = Date.now();
    const traceId = await observabilityManager.startTrace(sessionId, query);

    try {
      const initialState = { sessionId, query, uploadedFile };
      const finalState = await this.workflow.invoke(initialState, {
        configurable: { thread_id: sessionId },
      });
      const totalLatency = Date.now() - startTime;

      await observabilityManager.endTrace(traceId, finalState.finalResponse, totalLatency, false);
      return {
        text: finalState.finalResponse,
        requiresHandoff: finalState.requiresHandoff,
        handoffReason: finalState.handoffReason,
      };
    } catch (error: any) {
      const totalLatency = Date.now() - startTime;
      await observabilityManager.endTrace(traceId, '', totalLatency, true, error.message);
      throw error;
    }
  }
}
