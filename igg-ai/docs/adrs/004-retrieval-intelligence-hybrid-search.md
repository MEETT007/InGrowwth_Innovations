# ADR 004: 10-Stage Retrieval Intelligence Pipeline & Hybrid Search

## Context
Retrieving context for an LLM query strictly via dense vector similarity often misses exact keyword matches (e.g., specific acronyms or project names).

## Decision
Built a 10-stage `Retrieval Intelligence Engine` that implements **Hybrid Search**:
1. Uses dense vectors for semantic similarity.
2. Uses sparse vectors (BM25/Keywords) for exact matches.
3. Merges them using the Reciprocal Rank Fusion (RRF) algorithm.

## Consequences
- **Pros**: Massively improves retrieval accuracy. Removes duplicate overlapping chunks via hashing. Enforces strict token budgets before the LLM sees the context.
- **Cons**: RRF can occasionally suppress highly semantic results if keyword scores are completely absent, requiring careful weight tuning (`RAG_DENSE_WEIGHT` vs `RAG_KEYWORD_WEIGHT`).
