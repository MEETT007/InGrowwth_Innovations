# ADR 001: AI Platform Isolation & Modular Structure

## Context
The InGrowwth Innovations web application exists within a Next.js App Router codebase. We needed to add an Enterprise AI Platform that is extremely scalable, provider-agnostic, and completely separate from UI/Frontend concerns.

## Decision
We decided to strictly isolate the AI Platform by placing it entirely within a root `igg-ai/` folder, distinct from the `src/` directory. The AI platform maintains its own `package.json`, runs as an independent Fastify service, and contains highly modular sub-packages (`core`, `ingestion`, `rag`, `consultant`). 

## Consequences
- **Pros**: The Next.js build is entirely unaffected by AI dependencies (like Qdrant, LangGraph, or Pino). The AI platform can be scaled on separate infrastructure (e.g., Python microservices in the future, if needed, though we are sticking to TS for now).
- **Cons**: Requires running two separate servers during local development (`Next.js` on port 3000, `Fastify` on port 4000).
