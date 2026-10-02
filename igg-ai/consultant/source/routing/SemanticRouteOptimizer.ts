import { ReasoningContextObject } from '../models/ReasoningContextObject';
import { Logger } from '../../../core/source/utils/Logger';

export type SemanticRouteType =
  | 'FAST_GREETING'
  | 'CALENDAR_BOOKING'
  | 'HEAVY_ARCHITECTURE_CODING'
  | 'DEEP_REASONING'
  | 'PRODUCT_MVP_IDEATION'
  | 'ENTERPRISE_STRATEGY';

export interface SemanticRouteDecision {
  route: SemanticRouteType;
  isFastPath: boolean;
  fastResponse?: string;
  recommendedModel: string;
  skillContext: string;
  tokenSavingsPercent: number;
}

export class SemanticRouteOptimizer {
  /**
   * Evaluates the incoming query and context using high-velocity semantic routing.
   * Eliminates unnecessary LLM token consumption for predictable routes (greetings, calendar booking),
   * while routing deep technical and architectural queries directly to Qwen 2.5 Coder 14B
   * enriched with enterprise engineering skills.
   */
  public static route(query: string, rco?: ReasoningContextObject): SemanticRouteDecision {
    const raw = (query || '').trim();
    const lower = raw.toLowerCase();

    // 1. Fast Path: Conversational Greetings & Small Talk (0 LLM Tokens Burned)
    const isExactGreeting =
      /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|howdy|sup|ping|test|hi there|hello there)\b/i.test(
        lower
      ) && raw.split(/\s+/).length <= 4;

    const isGeneralIntro =
      /^(who are you|what is ingrowwth|what do you do|tell me about ingrowwth|about you|help me)\??$/i.test(
        lower
      );

    if (isExactGreeting || isGeneralIntro) {
      Logger.info('[SemanticRouter] Fast-routing greeting query to Zero-Token Instant Path');
      return {
        route: 'FAST_GREETING',
        isFastPath: true,
        fastResponse: `### Welcome to InGrowwth Innovations

I am the **Lead AI Technical Consultant** for InGrowwth Innovations. We are a premier IT Services, Technology Solutions, and Startup Innovation company.

#### What We Engineer:
* **Enterprise Full-Stack Platforms**: Next.js 16, React 19, TypeScript, and microservices architectures.
* **Agentic AI & Machine Learning**: Self-hosted LLM inference, LangGraph workflows, and high-precision RAG.
* **Cloud Solutions & Scalable DevOps**: Modern containerized systems on AWS, GCP, and Azure.
* **Startup MVP Acceleration**: Rapid transformation of ambitious product concepts into production-ready platforms.

How can we assist with your architecture, system design, or engineering roadmap today?`,
        recommendedModel: 'igg-flash-turbo',
        skillContext: 'General Corporate Grounding',
        tokenSavingsPercent: 100,
      };
    }

    // 2. Fast Path: Calendar & Strategy Consultation Booking (0 LLM Tokens Burned)
    const isMeetingIntent =
      /(schedule|book|meeting|appointment|calendar|call with|consultation|talk to|connect with|strategy call|discovery call|demo|meet with)/i.test(
        lower
      );

    if (isMeetingIntent) {
      Logger.info('[SemanticRouter] Fast-routing meeting booking query to Interactive Calendar Path');
      return {
        route: 'CALENDAR_BOOKING',
        isFastPath: true,
        fastResponse: `### Schedule an Enterprise Technical Consultation

I would be pleased to coordinate a technical discovery session for you with our **Enterprise Solutions Architecture & Leadership Team**.

An interactive calendar booking module has been loaded directly below:
1. **Select Date & Slot**: Pick your preferred 30-minute consultation window.
2. **Google Meet Integration**: An automatic video conference link will be provisioned.
3. **Calendar Invite**: Download an \`.ICS\` file or add directly to your Google Calendar.

Please feel free to share any architecture diagrams, tech stack requirements, or MVP milestones below so our team can prepare tailored insights ahead of our session.`,
        recommendedModel: 'igg-flash-turbo',
        skillContext: 'Meeting Coordination Protocol',
        tokenSavingsPercent: 100,
      };
    }

    // 3. Database Schema & Data Modeling Route (Specialized Skill Injection)
    const isDatabaseSchema =
      /(database schema|db schema|database model|data model|tables|sql schema|postgres schema|prisma schema|ddl|create table|schema design)/i.test(
        lower
      );

    if (isDatabaseSchema) {
      return {
        route: 'HEAVY_ARCHITECTURE_CODING',
        isFastPath: false,
        recommendedModel: 'gemini-3.5-flash',
        skillContext: `[SKILL: ENTERPRISE DATABASE SCHEMA ARCHITECT - INGROWWTH BENCHMARK]
You must provide a production-ready, fully realized database schema. DO NOT provide generic text or placeholders.
Include:
1. Executive Entity-Relationship Overview (Organizations, Users, Subscriptions, Audit Logs, Vector Embeddings).
2. Production-Grade PostgreSQL DDL:
   - Primary Keys: UUID \`gen_random_uuid()\` for high-concurrency inserts.
   - Timestamps: \`created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL\`, \`updated_at TIMESTAMPTZ\`.
   - Soft Deletes: \`deleted_at TIMESTAMPTZ NULL\`.
   - Foreign Keys with \`ON DELETE CASCADE\` / \`SET NULL\`.
   - Performance Indexes: B-Tree on foreign keys & slug, GIN on JSONB, HNSW on \`vector(1536)\`.
3. Complete Prisma ORM Schema (\`schema.prisma\`) with all models and relations.
4. Multi-Tenant Row-Level Security (RLS) policies.`,
        tokenSavingsPercent: 50,
      };
    }

    // 4. Product MVP & Ideation Route
    const isProductIdeation =
      /(idea|ideas|product idea|app idea|mvp|saas idea|expense app|fintech|marketplace|build a startup)/i.test(
        lower
      );

    if (isProductIdeation) {
      return {
        route: 'PRODUCT_MVP_IDEATION',
        isFastPath: false,
        recommendedModel: 'gemini-3.5-flash',
        skillContext: `[SKILL: STARTUP MVP ACCELERATION & PRODUCT BENCHMARKS]
- Grounding: InGrowwth Innovations specializes in rapid 4-to-6 week production-grade MVP launches.
- Strategy: Always deliver 4 innovative, market-differentiated concepts with modern tech stack recommendations (Next.js 16, React 19, Neon Postgres, LangGraph).
- Focus: Emphasize business value, unit economics, automation, and real-time user delight.`,
        tokenSavingsPercent: 45,
      };
    }

    // 5. Heavy Route: Architecture, Code Generation & System Design
    const isArchitectureOrCode =
      /(architect|system design|microservice|database|postgres|neon|sql|schema|next\.js|react|typescript|docker|kubernetes|api|rest|graphql|concurrency|scalability|performance|security|soc2|jwt|auth|code|implement|function|class)/i.test(
        lower
      );

    if (isArchitectureOrCode) {
      return {
        route: 'HEAVY_ARCHITECTURE_CODING',
        isFastPath: false,
        recommendedModel: 'gemini-3.5-flash',
        skillContext: `[SKILL: ENTERPRISE ARCHITECTURE & MODERN TECH STACK - INGROWWTH BENCHMARK]
- Runtime: Next.js 16 (App Router, Server Actions, Turbopack, Streaming SSR) + React 19 + TypeScript strict.
- Data Layer: Serverless PostgreSQL (Neon) with pgvector (1536-dim cosine similarity), connection pooling with PgBouncer.
- AI & Orchestration: LangGraph state machines, localized Ollama inference (Qwen 2.5 Coder 14B / DeepSeek-R1).
- Security & Guardrails: Zero-trust perimeter, mTLS, JWT with JWKS validation (<5ms overhead), SOC2 immutable audit logs.
- Formatting Standards: Provide structured Markdown, architectural trade-off matrices, concrete type-safe code snippets, and phased implementation milestones.`,
        tokenSavingsPercent: 55,
      };
    }

    // 5. Deep Reasoning Route
    if (rco?.options?.reasoning || rco?.options?.model === 'igg-deep-reasoning') {
      return {
        route: 'DEEP_REASONING',
        isFastPath: false,
        recommendedModel: 'qwen2.5-coder:14b',
        skillContext: `[SKILL: DEEP CHAIN-OF-THOUGHT & VERIFICATION]
- Mandatory: Begin response with <think>...</think> analyzing requirements, boundary conditions, edge cases, and performance constraints.
- Output: Clean, authoritative synthesis following </think>.`,
        tokenSavingsPercent: 40,
      };
    }

    // 6. Default Enterprise Strategy Route
    return {
      route: 'ENTERPRISE_STRATEGY',
      isFastPath: false,
      recommendedModel: 'qwen2.5-coder:14b',
      skillContext: `[SKILL: ENTERPRISE IT CONSULTING]
- Authoritative voice representing InGrowwth Innovations.
- Focus on future-proofing businesses with innovative IT, cloud resilience, and high-velocity engineering.`,
      tokenSavingsPercent: 50,
    };
  }
}
