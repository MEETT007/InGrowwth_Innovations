import React from 'react';
import { PhoneCall, ShieldAlert, FileText, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HandoffCard({ reason }: { reason?: string }) {
  let title = 'Human Consultation Required';
  let description =
    'This request requires specialized expertise. I am connecting you with our Enterprise Architecture team.';
  let Icon = PhoneCall;

  if (reason === 'LEGAL_INQUIRY') {
    title = 'Legal / Compliance Review';
    description =
      'Requests involving NDAs, SLAs, or legal compliance require our legal and enterprise risk team to evaluate.';
    Icon = ShieldAlert;
  } else if (reason === 'CUSTOM_PRICING') {
    title = 'Enterprise Negotiation';
    description =
      'Custom pricing, discounts, and equity structures require a direct consultation with our sales directors.';
    Icon = Banknote;
  } else if (reason === 'HR_INQUIRY') {
    title = 'Human Resources';
    description =
      'For career opportunities and HR inquiries, please connect with our recruitment team.';
    Icon = FileText;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-800/80 border border-orange-500/30 rounded-xl p-5 mt-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-orange-400 mb-2">
            <Icon className="w-5 h-5" />
            <h4 className="font-semibold tracking-tight">{title}</h4>
          </div>
          <p className="text-sm text-gray-300 max-w-md mb-5 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex space-x-3 relative z-10">
        <button className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium shadow-lg shadow-orange-900/20 transition-colors flex items-center justify-center space-x-2">
          <span>Schedule Human Call</span>
        </button>
        <button className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors">
          Email Team
        </button>
      </div>
    </motion.div>
  );
}
