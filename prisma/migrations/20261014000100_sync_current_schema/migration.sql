-- AlterTable
ALTER TABLE "portfolio_projects" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "services" RENAME COLUMN "body" TO "content";
ALTER TABLE "services" ALTER COLUMN "content" SET DEFAULT '';
ALTER TABLE "services"
ADD COLUMN     "features" JSONB,
ADD COLUMN     "isExpertise" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "process" JSONB,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "techStack" JSONB;

-- CreateTable
CREATE TABLE "ai_sessions" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_messages" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "interactiveData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_traces" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT,
    "latency" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_traces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_events" (
    "id" TEXT NOT NULL,
    "traceId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "latency" INTEGER NOT NULL DEFAULT 0,
    "rcoSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_versions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompt_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_evaluation_runs" (
    "id" TEXT NOT NULL,
    "dataset" TEXT NOT NULL,
    "scoreGroundedness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreRelevance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgLatency" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_evaluation_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "resourceId" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_api_quotas" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "requestsCount" INTEGER NOT NULL DEFAULT 0,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "limitRequests" INTEGER NOT NULL DEFAULT 100,
    "limitTokens" INTEGER NOT NULL DEFAULT 50000,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_api_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_sessions_sessionId_key" ON "ai_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "ai_sessions_sessionId_idx" ON "ai_sessions"("sessionId");

-- CreateIndex
CREATE INDEX "ai_sessions_createdAt_idx" ON "ai_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "ai_chat_messages_sessionId_idx" ON "ai_chat_messages"("sessionId");

-- CreateIndex
CREATE INDEX "ai_chat_messages_createdAt_idx" ON "ai_chat_messages"("createdAt");

-- CreateIndex
CREATE INDEX "ai_traces_sessionId_idx" ON "ai_traces"("sessionId");

-- CreateIndex
CREATE INDEX "ai_traces_createdAt_idx" ON "ai_traces"("createdAt");

-- CreateIndex
CREATE INDEX "ai_events_traceId_idx" ON "ai_events"("traceId");

-- CreateIndex
CREATE INDEX "ai_events_stageName_idx" ON "ai_events"("stageName");

-- CreateIndex
CREATE INDEX "ai_prompt_versions_name_idx" ON "ai_prompt_versions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ai_prompt_versions_name_version_key" ON "ai_prompt_versions"("name", "version");

-- CreateIndex
CREATE INDEX "ai_evaluation_runs_createdAt_idx" ON "ai_evaluation_runs"("createdAt");

-- CreateIndex
CREATE INDEX "ai_audit_logs_action_idx" ON "ai_audit_logs"("action");

-- CreateIndex
CREATE INDEX "ai_audit_logs_severity_idx" ON "ai_audit_logs"("severity");

-- CreateIndex
CREATE INDEX "ai_audit_logs_createdAt_idx" ON "ai_audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_api_quotas_identifier_key" ON "ai_api_quotas"("identifier");

-- CreateIndex
CREATE INDEX "ai_api_quotas_identifier_idx" ON "ai_api_quotas"("identifier");

-- CreateIndex
CREATE INDEX "ai_api_quotas_resetAt_idx" ON "ai_api_quotas"("resetAt");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_projects_slug_key" ON "portfolio_projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_slug_idx" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_isExpertise_idx" ON "services"("isExpertise");

-- AddForeignKey
ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ai_sessions"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
