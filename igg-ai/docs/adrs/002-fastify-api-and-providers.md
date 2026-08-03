# ADR 002: Fastify API & Provider Abstractions

## Context
The AI core required a lightweight, high-performance API to expose its capabilities to the main web app, and needed to be resilient against LLM provider lock-in.

## Decision
1. **API**: Chosen Fastify over Express or Next.js API Routes due to its high performance and built-in structured logging ecosystem (Pino). 
2. **Abstractions**: Created strict TypeScript interfaces (`ILLMProvider`, `IEmbeddingProvider`, `IVectorStore`) inside `igg-ai/core`. Business logic is forbidden from importing specific SDKs (like `openai` or `qdrant-client`) directly.

## Consequences
- **Pros**: Any AI model can be swapped simply by updating the `.env.ai` variables (e.g., switching from Ollama to OpenAI) without changing a single line of business logic.
- **Cons**: Slight overhead in defining strict interface wrappers for every feature the AI exposes.
