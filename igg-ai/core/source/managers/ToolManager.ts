export interface AITool {
  name: string;
  description: string;
  schema: Record<string, any>; // JSON Schema
  execute(args: Record<string, any>): Promise<any>;
}

export class ToolManager {
  private tools: Map<string, AITool> = new Map();

  registerTool(tool: AITool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): AITool {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool ${name} not found`);
    return tool;
  }

  listTools(): Omit<AITool, "execute">[] {
    return Array.from(this.tools.values()).map(({ name, description, schema }) => ({
      name,
      description,
      schema,
    }));
  }

  async executeTool(name: string, args: Record<string, any>): Promise<any> {
    const tool = this.getTool(name);
    // Here we would ideally validate `args` against `tool.schema`
    return await tool.execute(args);
  }
}

export const toolManager = new ToolManager();
