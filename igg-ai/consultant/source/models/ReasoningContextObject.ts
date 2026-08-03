export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface ReasoningContextObject {
  conversation: {
    sessionId: string;
    history: Message[];
    currentQuestion: string;
  };
  intent: {
    primary: string;
    confidence: number;
    requiresClarification: boolean;
  };
  businessContext: {
    recommendedServices: string[];
    targetIndustries: string[];
    portfolioMatches: string[];
  };
  knowledge: {
    documents: string[]; // Chunks from retrieval
    citations: string[];
  };
  constraints: {
    mustNotHallucinate: boolean;
    tone: "professional" | "consultative" | "technical";
    unknownResponseFallback: string;
  };
  generation: {
    systemPrompt?: string;
    llmResponse?: string;
    cta?: string;
    isValid?: boolean;
  };
}
