-- CreateIndex
CREATE INDEX "blog_posts_createdAt_idx" ON "blog_posts"("createdAt");

-- CreateIndex
CREATE INDEX "case_studies_createdAt_idx" ON "case_studies"("createdAt");

-- CreateIndex
CREATE INDEX "job_applications_createdAt_idx" ON "job_applications"("createdAt");

-- CreateIndex
CREATE INDEX "jobs_createdAt_idx" ON "jobs"("createdAt");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_subscribedAt_idx" ON "newsletter_subscribers"("subscribedAt");

-- CreateIndex
CREATE INDEX "portfolio_projects_createdAt_idx" ON "portfolio_projects"("createdAt");

-- CreateIndex
CREATE INDEX "team_members_createdAt_idx" ON "team_members"("createdAt");
