export interface ITool {
  name: string;
  description: string;
  schema: Record<string, any>; // Typically a Zod schema or JSON schema definition
  execute(args: Record<string, any>): Promise<any>;
}
