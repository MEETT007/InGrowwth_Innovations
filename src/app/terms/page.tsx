import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { FileCheck, Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Terms of Service | InGrowwth Innovations',
  description:
    'Review the terms and conditions governing the use of InGrowwth Innovations software solutions.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto flex flex-col gap-12">
      <SectionHeader
        title="Terms of Service"
        subtitle="Agreement & Policies"
        description="By accessing or using InGrowwth Innovations platform, you agree to comply with these terms."
      />

      <div className="flex flex-col gap-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
        <Card className="glass-card p-6 sm:p-8">
          <CardContent className="space-y-6 pt-0">
            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg">
              <FileCheck className="w-6 h-6" />
              <h2>1. Scope of Services</h2>
            </div>
            <p className="text-muted-foreground">
              InGrowwth Innovations provides software engineering, cloud architecture, AI
              integration, and enterprise consulting services. Specific deliverables, project
              milestones, and SLA terms are defined in individual client Master Services Agreements
              (MSAs) or Statements of Work (SOWs).
            </p>

            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg pt-4">
              <Scale className="w-6 h-6" />
              <h2>2. Intellectual Property Rights</h2>
            </div>
            <p className="text-muted-foreground">
              All proprietary software algorithms, trademarks, UI/UX designs, and code repositories
              created for custom client projects remain the exclusive property of the client upon
              full payment. InGrowwth Innovations retains rights to core reusable utility libraries.
            </p>

            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg pt-4">
              <CheckCircle2 className="w-6 h-6" />
              <h2>3. Client Responsibilities</h2>
            </div>
            <p className="text-muted-foreground">
              Clients agree to provide accurate project specifications, timely feedback, and
              authorized access credentials necessary to complete software deliverables according to
              agreed timelines.
            </p>

            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg pt-4">
              <AlertCircle className="w-6 h-6" />
              <h2>4. Limitation of Liability</h2>
            </div>
            <p className="text-muted-foreground">
              InGrowwth Innovations is not liable for indirect, incidental, or consequential damages
              resulting from third-party server downtime, unapproved client code modifications, or
              force majeure events.
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Last updated: October 2026. For questions regarding terms, email{' '}
          <a
            href="mailto:legal@ingrowwthinnovations.com"
            className="text-indigo-500 hover:text-indigo-400 transition-colors underline"
          >
            legal@ingrowwthinnovations.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
