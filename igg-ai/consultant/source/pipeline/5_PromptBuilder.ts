import { IConsultantPipelineStage } from "./IConsultantPipelineStage";
import { ReasoningContextObject } from "../models/ReasoningContextObject";
import { SemanticRouteOptimizer } from "../routing/SemanticRouteOptimizer";

export class PromptBuilder implements IConsultantPipelineStage {
  name = "PromptBuilder";

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const question = rco.conversation.currentQuestion;

    // 1. Evaluate Semantic Route & Token Optimizer
    const routeDecision = SemanticRouteOptimizer.route(question, rco);

    // If fast path is matched (greeting, calendar booking), set the response immediately with 0 token waste
    if (routeDecision.isFastPath && routeDecision.fastResponse) {
      rco.generation.llmResponse = routeDecision.fastResponse;
      rco.generation.isValid = true;
      return rco;
    }

    // Authoritative InGrowwth Innovations Ground Truth Knowledge (Compact Token-Optimized)
    const companyKnowledge = `
You are the Lead AI Technical Consultant of InGrowwth Innovations (IGG).

[ABOUT INGROWWTH INNOVATIONS]:
- Identity: Premier IT Services, Enterprise Engineering & Startup Product Innovation Company.
- Mission: "Future-Proof Your Business with Innovative IT". Engineering resilient cloud architectures, bespoke enterprise software, and agentic AI systems.
- Core Pillars: Full-Stack Web (Next.js 16, React 19, TypeScript), Mobile (Flutter, React Native), Cloud & DevOps (AWS/GCP/Azure, Docker, K8s), Enterprise AI (LangGraph, Ollama, self-hosted LLM inference), Cybersecurity (Zero-trust, SOC2/HIPAA), Startup MVP Acceleration.
- Leadership: Meet Trivedi (CEO), Darshan Dalwadi (CTO), Saurav Patel (COO).
- Track Record: 5+ years experience, 24/7 dedicated support, 96% client satisfaction, 90%+ client retention.
- Proprietary Suite: "IGG Architect Pro", "IGG Deep Reasoning", "IGG Flash Turbo".

[EXECUTIVE & BRANDING RULES]:
1. InGrowwth Innovations is STRICTLY an IT Services, Enterprise Software, and Startup Innovation company. NEVER confuse it with healthcare or hair loss.
2. Only refer to InGrowwth's proprietary model suite: "IGG Architect Pro", "IGG Deep Reasoning", and "IGG Flash Turbo". NEVER mention third-party AI provider names (Gemini, Claude, OpenAI, DeepSeek, Anthropic) to the user.
3. [MEETING PROTOCOL]: Do NOT repeatedly bring up or take the CEO's name (Meet Trivedi) in meeting scheduling or general conversations. Refer professionally to "our Solutions Architecture & Leadership Team". Only share specific leadership names if explicitly asked.
4. When asked for ideas or architecture, provide high-value, production-grade solutions, structural trade-offs, and an MVP execution blueprint.

[BENCHMARK ENGINEERING SKILL INJECTION]:
${routeDecision.skillContext}
    `.trim();

    const retrievedDocs = rco.knowledge.documents.length > 0
      ? `\n\n[VERIFIED ENTERPRISE KNOWLEDGE]:\n${rco.knowledge.documents.join("\n\n")}`
      : '';

    const webContext = (rco.options?.webSnippets && rco.options.webSnippets.length > 0)
      ? `\n\n[REAL-TIME WEB SEARCH CONTEXT]:\n${rco.options.webSnippets.map((s, i) => `[Source ${i + 1}]: ${s}`).join('\n')}\nUse these real-time web findings to enrich your technical concepts and modern best practices.`
      : '';

    const reasoningDirective = (rco.options?.reasoning || rco.options?.model === 'igg-deep-reasoning')
      ? `\n\n[REASONING PROTOCOL]:
Begin your response with <think>...</think> providing a rigorous architectural chain-of-thought analysis covering requirements, trade-offs, latency SLAs, zero-trust security boundaries, and milestone planning. After </think>, deliver the clean, structured executive response with Markdown headers, bullet points, and code blueprints.`
      : '';

    const userLearningDirective = rco.options?.userLearningContext
      ? `\n\n${rco.options.userLearningContext}`
      : '';

    const systemPrompt = `
${companyKnowledge}${retrievedDocs}${webContext}${reasoningDirective}${userLearningDirective}
    `.trim();

    rco.generation.systemPrompt = systemPrompt;
    
    return rco;
  }
}
