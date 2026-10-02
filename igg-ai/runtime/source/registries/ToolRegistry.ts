import { ITool } from "../tools/ITool";
import { SearchWebsiteTool } from "../tools/SearchWebsiteTool";
import { WebSearchTool } from "../tools/WebSearchTool";

export class ToolRegistry {
  private tools = new Map<string, ITool>();

  constructor() {
    this.register(new SearchWebsiteTool());
    this.register(new WebSearchTool());
  }

  register(tool: ITool): void {
    if (this.tools.has(tool.name)) {
      return; // Idempotent registration
    }
    this.tools.set(tool.name, tool);
  }

  get(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  getAll(): ITool[] {
    return Array.from(this.tools.values());
  }
}

export const toolRegistry = new ToolRegistry();

