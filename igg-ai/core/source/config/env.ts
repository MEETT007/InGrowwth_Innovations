import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.ai" });

const envSchema = z.object({
  AI_API_PORT: z.string().default("4000"),
  ACTIVE_LLM_PROVIDER: z.string().default("ollama"),
  ACTIVE_LLM_MODEL: z.string().default("llama3"),
  ACTIVE_VISION_PROVIDER: z.string().optional(),
  ACTIVE_EMBEDDING_PROVIDER: z.string().default("ollama"),
  ACTIVE_SPEECH_PROVIDER: z.string().optional(),
  ACTIVE_VECTOR_STORE: z.string().default("qdrant"),
  LOG_LEVEL: z.string().default("info"),
  RAG_DENSE_WEIGHT: z.string().default("0.7"),
  RAG_KEYWORD_WEIGHT: z.string().default("0.3"),
  RAG_TOP_K: z.string().default("10"),
  RAG_TOKEN_BUDGET: z.string().default("4096"),
  RAG_RERANKER_ENABLED: z.string().default("true"),
  RAG_MIN_CONFIDENCE_SCORE: z.string().default("0.65"),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid AI Environment Variables:", parsed.error.format());
    throw new Error("Invalid AI Environment Configuration");
  }
  return parsed.data;
};

export const config = parseEnv();
