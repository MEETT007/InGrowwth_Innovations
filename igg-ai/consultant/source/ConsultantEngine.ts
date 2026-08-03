import { ReasoningContextObject } from './models/ReasoningContextObject';
import { ConversationAnalyzer } from './pipeline/1_ConversationAnalyzer';
import { QuestionClassifier } from './pipeline/2_QuestionClassifier';
import { HandoffEvaluator } from './pipeline/3_HandoffEvaluator';
import { RetrievalInvoker } from './pipeline/3_RetrievalInvoker';
import { BusinessRuleEngine } from './pipeline/4_BusinessRuleEngine';
import { PromptBuilder } from './pipeline/5_PromptBuilder';
import { LLMInvoker } from './pipeline/6_LLMInvoker';
import { ResponseValidator } from './pipeline/7_ResponseValidator';
import { CTAGenerator } from './pipeline/8_CTAGenerator';
import { observabilityManager } from '../../observability/source/ObservabilityManager';

export class ConsultantEngine {
  private pipeline = [
    new ConversationAnalyzer(),
    new QuestionClassifier(),
    new HandoffEvaluator(),
    new RetrievalInvoker(),
    new BusinessRuleEngine(),
    new PromptBuilder(),
    new LLMInvoker(),
    new ResponseValidator(),
    new CTAGenerator(),
  ];

  async process(sessionId: string, message: string): Promise<ReasoningContextObject> {
    // Initialize the Reasoning Context Object (RCO)
    let rco: ReasoningContextObject = {
      conversation: {
        sessionId,
        history: [],
        currentQuestion: message,
      },
      intent: {
        primary: 'unknown',
        confidence: 0,
        requiresClarification: false,
      },
      businessContext: {
        recommendedServices: [],
        targetIndustries: [],
        portfolioMatches: [],
      },
      knowledge: {
        documents: [],
        citations: [],
      },
      constraints: {
        mustNotHallucinate: true,
        tone: 'professional',
        unknownResponseFallback: '',
      },
      generation: {},
    };

    // Execute through the reasoning pipeline
    const traceId = await observabilityManager.findActiveTrace(sessionId);

    for (const stage of this.pipeline) {
      const startTime = Date.now();
      rco = await stage.execute(rco);
      const latency = Date.now() - startTime;

      if (traceId) {
        // Fire and forget logging
        observabilityManager.logEvent(traceId, stage.name, latency, rco);
      }

      // If handoff is required, we short-circuit the rest of the pipeline
      if (rco.generation.requiresHandoff) {
        break;
      }
    }

    return rco;
  }
}

export const consultantEngine = new ConsultantEngine();
