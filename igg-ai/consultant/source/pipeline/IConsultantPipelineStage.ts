import { ReasoningContextObject } from "../models/ReasoningContextObject";

export interface IConsultantPipelineStage {
  name: string;
  execute(rco: ReasoningContextObject): Promise<ReasoningContextObject>;
}
