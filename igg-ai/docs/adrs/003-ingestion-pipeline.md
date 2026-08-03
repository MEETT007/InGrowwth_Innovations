# ADR 003: Ingestion Pipeline & Zod Validation

## Context
Company knowledge must be automatically extracted, cleaned, and vectorized without hardcoded prompt injections. 

## Decision
1. **Connector Pattern**: Built an `IConnector` framework to handle diverse data streams (Website, Markdown, etc.).
2. **Processing Pipeline**: Implemented a sequential pipeline for cleaning, chunking, and enriching metadata (e.g., `contentHash`).
3. **Zod Validation**: Used `zod` in the core configuration engine to validate `.env.ai` at boot, preventing runtime crashes.

## Consequences
- **Pros**: Safe configuration loading. Extensible ingestion allowing future additions (like Notion or Drive connectors) simply by implementing `IConnector`.
- **Cons**: Chunking strategies must be carefully managed to avoid oversized vectors.
