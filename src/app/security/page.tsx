import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ShieldCheck, Server, Lock, Cpu, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Security & Compliance | InGrowwth Innovations',
  description:
    'Discover how InGrowwth Innovations safeguards system architecture, user credentials, and cloud databases.',
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-5xl mx-auto flex flex-col gap-12">
      <SectionHeader
        title="Security & Compliance"
        subtitle="Enterprise Security"
        description="Our multi-layered security infrastructure ensures your data and applications remain protected 24/7."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg">
              <Lock className="w-6 h-6" />
              <h3>End-to-End Encryption</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All network communication operates over strict TLS 1.3 encryption in transit. Database
              connections use SSL-mode requirements with Neon serverless postgres architecture.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card p-6">
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg">
              <Server className="w-6 h-6" />
              <h3>Authentication & Access Control</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Powered by Clerk Authentication with multi-factor authentication (MFA), role-based
              session claims, and protected route middleware on administrative portals.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card p-6">
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg">
              <ShieldCheck className="w-6 h-6" />
              <h3>Rate Limiting & DDoS Defense</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Public API routes and Server Actions are guarded by sliding-window rate limiting
              algorithms to prevent spam, brute-force attacks, and service degradation.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card p-6">
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center gap-3 text-indigo-500 font-semibold text-lg">
              <Cpu className="w-6 h-6" />
              <h3>Automated CI/CD Vulnerability Scanning</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              GitHub Actions workflows run automated type checks, ESLint code sanity, Docker build
              validations, and dependency audit checks prior to production release.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="glass-card p-8 rounded-3xl text-center flex flex-col items-center gap-4 border border-indigo-500/20">
        <CheckCircle className="w-10 h-10 text-indigo-500" />
        <h3 className="text-xl font-bold">Security Bug Bounty & Inquiries</h3>
        <p className="text-sm text-muted-foreground max-w-xl">
          If you discover a security vulnerability or have questions regarding compliance standards,
          please email security@ingrowwthinnovations.com.
        </p>
      </div>
    </main>
  );
}
