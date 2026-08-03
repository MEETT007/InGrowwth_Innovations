import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { toolRegistry } from "../registries/ToolRegistry";
import { consultantEngine } from "../../../consultant/source/ConsultantEngine";

// Define the state shape for the LangGraph agent
interface AgentState {
  sessionId: string;
  query: string;
  plan: string;
  toolResults: Record<string, any>;
  finalResponse: string;
}

export class LangGraphOrchestrator {
  private workflow: any;
  private checkpointer: MemorySaver;

  constructor() {
    this.checkpointer = new MemorySaver();
    this.buildGraph();
  }

  private buildGraph() {
    const graph = new StateGraph<AgentState>({
      channels: {
        sessionId: { value: (x, y) => y ?? x, default: () => "default" },
        query: { value: (x, y) => y ?? x, default: () => "" },
        plan: { value: (x, y) => y ?? x, default: () => "" },
        toolResults: { 
          value: (x, y) => ({ ...x, ...y }), 
          default: () => ({}) 
        },
        finalResponse: { value: (x, y) => y ?? x, default: () => "" }
      }
    });

    // Node 1: Planner
    graph.addNode("planner", async (state) => {
      // Stub: A real planner would use an LLM here to pick a tool.
      // For Phase 6 demonstration, we assume we always need the SearchWebsiteTool.
      return { plan: "search_website" };
    });

    // Node 2: Executor
    graph.addNode("executor", async (state) => {
      const toolToRun = state.plan;
      const tool = toolRegistry.get(toolToRun);
      
      let result = null;
      if (tool) {
        // We pass the raw query for now. Later the planner extracts args.
        result = await tool.execute({ query: state.query });
      }
      
      return { toolResults: { [toolToRun]: result } };
    });

    // Node 3: Consultant (Phase 5)
    graph.addNode("consultant", async (state) => {
      // The Consultant Engine will execute its 8 stages.
      // In a real full integration, we would seed the RCO with the `toolResults` gathered above.
      // For now, we invoke it directly to validate the chain.
      const rco = await consultantEngine.process(state.sessionId, state.query);
      return { finalResponse: rco.generation.llmResponse || "No response generated." };
    });

    // Edges
    (graph as any).addEdge(START, "planner");
    (graph as any).addEdge("planner", "executor");
    (graph as any).addEdge("executor", "consultant");
    (graph as any).addEdge("consultant", END);

    this.workflow = graph.compile({ checkpointer: this.checkpointer });
  }

  async run(sessionId: string, query: string): Promise<string> {
    const initialState = { sessionId, query };
    const finalState = await this.workflow.invoke(initialState, { configurable: { thread_id: sessionId } });
    return finalState.finalResponse;
  }
}
