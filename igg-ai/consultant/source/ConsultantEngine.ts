import { ReasoningContextObject } from "./models/ReasoningContextObject";
import { ConversationAnalyzer } from "./pipeline/1_ConversationAnalyzer";
import { QuestionClassifier } from "./pipeline/2_QuestionClassifier";
import { RetrievalInvoker } from "./pipeline/3_RetrievalInvoker";
import { BusinessRuleEngine } from "./pipeline/4_BusinessRuleEngine";
import { PromptBuilder } from "./pipeline/5_PromptBuilder";
import { LLMInvoker } from "./pipeline/6_LLMInvoker";
import { ResponseValidator } from "./pipeline/7_ResponseValidator";
import { CTAGenerator } from "./pipeline/8_CTAGenerator";

export class ConsultantEngine {
  private pipeline = [
    new ConversationAnalyzer(),
    new QuestionClassifier(),
    new RetrievalInvoker(),
    new BusinessRuleEngine(),
    new PromptBuilder(),
    new LLMInvoker(),
    new ResponseValidator(),
    new CTAGenerator()
  ];

  async process(sessionId: string, message: string): Promise<ReasoningContextObject> {
    
    // Initialize the Reasoning Context Object (RCO)
    let rco: ReasoningContextObject = {
      conversation: {
        sessionId,
        history: [],
        currentQuestion: message
      },
      intent: {
        primary: "unknown",
        confidence: 0,
        requiresClarification: false
      },
      businessContext: {
        recommendedServices: [],
        targetIndustries: [],
        portfolioMatches: []
      },
      knowledge: {
        documents: [],
        citations: []
      },
      constraints: {
        mustNotHallucinate: true,
        tone: "professional",
        unknownResponseFallback: ""
      },
      generation: {}
    };

    // Execute through the reasoning pipeline
    for (const stage of this.pipeline) {
      rco = await stage.execute(rco);
    }

    return rco;
  }
}

export const consultantEngine = new ConsultantEngine();
