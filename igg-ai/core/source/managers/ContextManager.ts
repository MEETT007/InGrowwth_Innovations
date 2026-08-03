export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export class ContextManager {
  private contexts: Map<string, Message[]> = new Map();

  createContext(sessionId: string, initialSystemPrompt?: string) {
    const messages: Message[] = [];
    if (initialSystemPrompt) {
      messages.push({ role: "system", content: initialSystemPrompt });
    }
    this.contexts.set(sessionId, messages);
  }

  addMessage(sessionId: string, message: Message) {
    const context = this.contexts.get(sessionId);
    if (!context) throw new Error(`Context for session ${sessionId} not found`);
    context.push(message);
  }

  getContext(sessionId: string): Message[] {
    return this.contexts.get(sessionId) || [];
  }

  // Placeholder for token counting and trimming logic
  trimContext(sessionId: string, maxTokens: number): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;
    // Basic trimming: keep system prompt, and last N messages
    if (context.length > 10) {
      const system = context.filter((m) => m.role === "system");
      const rest = context.slice(-10);
      this.contexts.set(sessionId, [...system, ...rest]);
    }
  }
}

export const contextManager = new ContextManager();
