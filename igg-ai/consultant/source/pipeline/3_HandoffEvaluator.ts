import { ReasoningContextObject } from '../models/ReasoningContextObject';
import { IConsultantPipelineStage } from './IConsultantPipelineStage';

export class HandoffEvaluator implements IConsultantPipelineStage {
  name = 'HandoffEvaluator';

  async execute(rco: ReasoningContextObject): Promise<ReasoningContextObject> {
    const question = rco.conversation.currentQuestion.toLowerCase();

    // Define high-risk or human-required triggers
    const legalKeywords = [
      'nda',
      'sla',
      'contract',
      'sue',
      'lawsuit',
      'legal',
      'compliance',
      'gdpr audit',
    ];
    const customPricingKeywords = ['discount', 'negotiate', 'custom pricing', 'equity'];
    const hrKeywords = ['hire me', 'job', 'salary', 'benefits'];

    const hasLegal = legalKeywords.some((k) => question.includes(k));
    const hasPricing = customPricingKeywords.some((k) => question.includes(k));
    const hasHR = hrKeywords.some((k) => question.includes(k));

    if (hasLegal) {
      rco.generation.requiresHandoff = true;
      rco.generation.handoffReason = 'LEGAL_INQUIRY';
      rco.generation.llmResponse =
        'This requires our Enterprise Architecture or Legal team to evaluate.';
    } else if (hasPricing) {
      rco.generation.requiresHandoff = true;
      rco.generation.handoffReason = 'CUSTOM_PRICING';
      rco.generation.llmResponse =
        'Custom enterprise negotiations and pricing require a direct consultation.';
    } else if (hasHR) {
      rco.generation.requiresHandoff = true;
      rco.generation.handoffReason = 'HR_INQUIRY';
      rco.generation.llmResponse = 'Please check our careers page or contact our HR team directly.';
    } else if (rco.intent.confidence < 0.4) {
      rco.generation.requiresHandoff = true;
      rco.generation.handoffReason = 'LOW_CONFIDENCE';
      rco.generation.llmResponse =
        'I want to make sure I give you the best advice. Let me connect you with a human consultant.';
    } else {
      rco.generation.requiresHandoff = false;
    }

    return rco;
  }
}
