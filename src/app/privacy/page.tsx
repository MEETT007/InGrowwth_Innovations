import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Privacy Policy | InGrowwth Innovations',
  description: 'Learn how InGrowwth Innovations collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto flex flex-col gap-12">
      <SectionHeader
        title="Privacy Policy"
        subtitle="Data Protection & Privacy"
        description="Your privacy is paramount to us. This policy outlines how we collect, handle, and safeguard your information."
      />

      <div className="flex flex-col gap-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
        <Card className="glass-card p-6 sm:p-8">
          <CardContent className="space-y-6 pt-0">
            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg">
              <Shield className="w-6 h-6" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-muted-foreground">
              We collect information you provide directly to us when submitting contact forms,
              requesting project quotes, subscribing to our newsletter, or interacting with our
              services. This may include your name, email address, phone number, company details,
              and project requirements.
            </p>

            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg pt-4">
              <Eye className="w-6 h-6" />
              <h2>2. How We Use Your Information</h2>
            </div>
            <p className="text-muted-foreground">
              We use the collected information to respond to inquiries, deliver software development
              services, send periodic newsletters (only if opted-in), improve our website
              performance, and maintain security across our infrastructure.
            </p>

            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg pt-4">
              <Lock className="w-6 h-6" />
              <h2>3. Data Security & Confidentiality</h2>
            </div>
            <p className="text-muted-foreground">
              We implement industry-standard security measures, including SSL/TLS encryption, secure
              database storage with strict access controls, and rate-limiting to protect your data
              from unauthorized access, disclosure, or alteration.
            </p>

            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg pt-4">
              <FileText className="w-6 h-6" />
              <h2>4. Third-Party Services & Analytics</h2>
            </div>
            <p className="text-muted-foreground">
              We do not sell or rent your personal data to third parties. We may utilize trusted
              third-party providers (such as Clerk for authentication and Resend for transactional
              email delivery) strictly to operate our platform securely.
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Last updated: October 2026. For privacy concerns, contact us at
          privacy@ingrowwthinnovations.com.
        </p>
      </div>
    </main>
  );
}
