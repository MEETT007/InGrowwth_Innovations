'use client';

import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, FileText, Banknote, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HandoffCard({ reason }: { reason?: string }) {
  const [scheduled, setScheduled] = useState(false);

  let title = 'Human Solutions Architecture Consultation';
  let description =
    'This inquiry entails high-complexity constraints or specialized domain verification. We recommend routing this to our Principal Architect.';
  let Icon = PhoneCall;
  let accentColor = 'border-amber-500/40 bg-amber-950/20 text-amber-400';

  if (reason === 'LEGAL_INQUIRY') {
    title = 'Legal, Security & Compliance Review';
    description =
      'Inquiries involving custom DPAs, SLAs, BAAs, or enterprise certifications are routed to our Chief Compliance Officer.';
    Icon = ShieldAlert;
    accentColor = 'border-red-500/40 bg-red-950/20 text-red-400';
  } else if (reason === 'CUSTOM_PRICING') {
    title = 'Enterprise Volume & Strategic Pricing';
    description =
      'Custom GPU compute quotas, dedicated clusters, and multi-year contract options are handled directly with our executive sales directors.';
    Icon = Banknote;
    accentColor = 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400';
  } else if (reason === 'HR_INQUIRY') {
    title = 'Executive Talent & Careers Partnership';
    description =
      'For engineering fellowships, principal roles, or advisory positions, please connect with our Talent team.';
    Icon = FileText;
    accentColor = 'border-indigo-500/40 bg-indigo-950/20 text-indigo-400';
  }

  if (scheduled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 mt-4 text-center"
      >
        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-white mb-1">Handoff Request Registered</h4>
        <p className="text-xs text-slate-300">
          Our Senior Lead will reach out within 2 business hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 mt-4 relative overflow-hidden backdrop-blur-md ${accentColor}`}
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xl">{description}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => setScheduled(true)}
          className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Request Priority Callback</span>
        </button>

        <a
          href="mailto:consulting@ingrowwth.com"
          className="py-2.5 px-4 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-white/10 transition-all flex items-center justify-center gap-2 text-center"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Architecture Team</span>
        </a>
      </div>
    </motion.div>
  );
}
