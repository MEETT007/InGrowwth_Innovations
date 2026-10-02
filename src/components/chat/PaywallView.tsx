'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  Shield,
  ArrowRight,
  Headphones,
  Award,
} from 'lucide-react';
import Link from 'next/link';

export default function PaywallView() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const tiers = [
    {
      name: 'Starter Developer',
      description: 'Ideal for independent developers prototyping single services and scripts.',
      price: billingCycle === 'annual' ? 19 : 24,
      badge: 'Starter',
      isPopular: false,
      features: [
        '50 AI Architecture Consultations / month',
        'Standard ADR Generation',
        'Community Discord Support',
        'Basic Code & Schema Export',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline',
    },
    {
      name: 'Consultant Pro',
      description: 'Full-power Agentic architecture analysis with LangGraph reasoning and RCO.',
      price: billingCycle === 'annual' ? 49 : 59,
      badge: 'Most Popular',
      isPopular: true,
      features: [
        'Unlimited AI Consultations & Multi-turn Reasoning',
        'Deep Requirement Analysis & ADR Synthesis',
        'Document Ingestion (PDF, Markdown, Wireframes)',
        'Automated Executive Architecture Reports',
        'Direct Discovery Call Scheduling with Lead Architect',
        'Priority Latency & 99.9% Uptime SLA',
      ],
      buttonText: 'Upgrade to Pro Architect',
      buttonVariant: 'primary',
    },
    {
      name: 'Enterprise Scale',
      description: 'Custom self-hosted agent pipelines, private VPC vector stores, and custom SLA.',
      price: billingCycle === 'annual' ? 199 : 249,
      badge: 'Enterprise',
      isPopular: false,
      features: [
        'Everything in Consultant Pro',
        'Dedicated pgvector Tenant & Custom Embeddings',
        'Fine-tuned System Prompts & Guardrails',
        'Custom LangGraph Workflows & Integrations',
        'SOC2 & HIPAA Compliance Guarantee',
        '24/7 Dedicated Solutions Engineer',
      ],
      buttonText: 'Contact Enterprise',
      buttonVariant: 'outline',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Neon Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-3xl text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>InGrowwth AI Architect Studio</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Unlock Unlimited{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            AI Architecture Intelligence
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Your 15-day complimentary trial has concluded. Join visionary engineering teams using
          InGrowwth AI to architect, evaluate, and scale mission-critical systems.
        </p>

        {/* Billing Switch */}
        <div className="pt-4 flex items-center justify-center gap-3 select-none">
          <span
            className={`text-xs font-semibold cursor-pointer ${
              billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() =>
              setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')
            }
            className="w-12 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 p-0.5 flex items-center transition-colors relative cursor-pointer"
            aria-label="Toggle Billing Cycle"
          >
            <div
              className={`w-5 h-5 rounded-full bg-indigo-500 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>

          <span
            className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual' ? 'text-white' : 'text-slate-500'
            }`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual Billing
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              tier.isPopular
                ? 'bg-gradient-to-b from-indigo-950/60 to-[#0e121e] border-2 border-indigo-500/60 shadow-2xl shadow-indigo-500/20 scale-100 md:-translate-y-2'
                : 'bg-[#0c0f18]/80 border border-white/10 hover:border-white/20'
            }`}
          >
            {tier.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-indigo-500/40">
                {tier.badge}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                {!tier.isPopular && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                    {tier.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed min-h-[36px]">
                {tier.description}
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/10">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  ${tier.price}
                </span>
                <span className="text-xs text-slate-400">/ seat / month</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        tier.isPopular
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                tier.isPopular
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
              }`}
            >
              <span>{tier.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Trust & Compliance Strip */}
      <div className="relative z-10 w-full max-w-4xl border-t border-white/10 pt-8 flex flex-wrap items-center justify-around gap-6 text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>SOC2 Type II &amp; HIPAA Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>99.9% Guaranteed API SLA</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>14-Day Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-purple-400" />
          <span>Priority Architect Consultation</span>
        </div>
      </div>

      {/* Return link */}
      <div className="relative z-10 mt-8 text-center">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4"
        >
          ← Return to InGrowwth Innovations Homepage
        </Link>
      </div>
    </div>
  );
}
