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
