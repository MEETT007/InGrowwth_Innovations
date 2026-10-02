import { IConsultantPipelineStage } from './IConsultantPipelineStage';
import { ReasoningContextObject } from '../models/ReasoningContextObject';

export class QuestionClassifier implements IConsultantPipelineStage {
  name = 'QuestionClassifier';

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const question = rco.conversation.currentQuestion.toLowerCase();

    const trimmed = question.trim();

    // Check if the user is greeting or making small talk (Fast Tier candidate)
    const isGreeting =
      /^(hi|hello|hey|greetings|good morning|good evening|howdy|what's up|how are you|who are you|help|ping)\b/i.test(
        trimmed
      ) || trimmed.length < 15;

    if (isGreeting) {
      rco.intent.primary = 'greeting';
      rco.intent.requiresClarification = false;
      rco.intent.confidence = 0.98;
    } else if (
      question.includes('architect') ||
      question.includes('system design') ||
      question.includes('database') ||
      question.includes('microservice') ||
      question.includes('code') ||
      question.includes('schema') ||
      question.includes('scale') ||
      question.includes('stack')
    ) {
      rco.intent.primary = 'architecture_request';
      rco.intent.requiresClarification = false;
      rco.intent.confidence = 0.95;
    } else if (question.includes('i need an erp') || question.includes('build an app') || question.includes('quote') || question.includes('pricing')) {
      rco.intent.primary = 'consultation_request';
      rco.intent.requiresClarification = true;
      rco.intent.confidence = 0.9;
    } else {
      rco.intent.primary = 'direct_question';
      rco.intent.requiresClarification = false;
      rco.intent.confidence = 0.85;
    }

    return rco;
  }
}
