export interface PromptTemplate {
  id: string;
  version: string;
  template: string;
  variables: string[];
}

export class PromptManager {
  private registry: Map<string, PromptTemplate> = new Map();

  registerPrompt(prompt: PromptTemplate) {
    this.registry.set(prompt.id, prompt);
  }

  getPrompt(id: string): PromptTemplate {
    const prompt = this.registry.get(id);
    if (!prompt) throw new Error(`Prompt ${id} not found`);
    return prompt;
  }

  renderPrompt(id: string, variables: Record<string, string>): string {
    const prompt = this.getPrompt(id);
    let rendered = prompt.template;
    for (const variable of prompt.variables) {
      if (!(variable in variables)) throw new Error(`Missing variable ${variable} for prompt ${id}`);
      rendered = rendered.replace(new RegExp(`{{${variable}}}`, "g"), variables[variable]);
    }
    return rendered;
  }
}

export const promptManager = new PromptManager();
