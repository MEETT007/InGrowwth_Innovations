'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Copy, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackControlsProps {
  messageId: string;
  query?: string;
  contentToCopy?: string;
  latencyMs?: number;
  userId?: string;
}

const NEGATIVE_REASONS = [
  'Too generic',
  'Wanted runnable code',
  'Needs DDL / schema',
  'Inaccurate logic',
  'Too slow',
];

export default function FeedbackControls({
  messageId,
  query = 'Architectural Consultation Query',
  contentToCopy,
  latencyMs,
  userId,
}: FeedbackControlsProps) {
  const [feedback, setFeedback] = useState<'UP' | 'DOWN' | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendFeedbackApi = async (rating: 'POSITIVE' | 'NEGATIVE', reason?: string) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          query,
          reason,
          userId,
        }),
      });
      setFeedbackSaved(true);
    } catch (e) {
      console.error('Feedback submit failed', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePositiveFeedback = () => {
    setFeedback('UP');
    sendFeedbackApi('POSITIVE');
  };

  const handleNegativeFeedback = (reason?: string) => {
    setFeedback('DOWN');
    if (reason) {
      setSelectedReason(reason);
      sendFeedbackApi('NEGATIVE', reason);
    }
  };

  const handleCopy = async () => {
    if (!contentToCopy) return;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-white/5 text-xs text-slate-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">Was this accurate?</span>

          <AnimatePresence mode="wait">
            {!feedback ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1"
              >
                <button
                  type="button"
                  onClick={handlePositiveFeedback}
                  aria-label="Thumbs up - Learned preference"
                  title="Good response (AI learns you like this format)"
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNegativeFeedback()}
                  aria-label="Thumbs down - Needs improvement"
                  title="Unsatisfactory response (AI learns to adapt)"
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : feedback === 'UP' ? (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] text-emerald-400 font-medium flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Model learned your preference
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] text-rose-400 font-medium flex items-center gap-1"
              >
                Feedback recorded
              </motion.span>
            )}
          </AnimatePresence>

          {contentToCopy && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer ml-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {latencyMs && (
          <span className="text-[10px] font-mono text-slate-500">
            Generated in {(latencyMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      {/* Negative Reason Selector Pills */}
      <AnimatePresence>
        {feedback === 'DOWN' && !selectedReason && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 flex-wrap pt-1"
          >
            <span className="text-[10px] text-slate-400 mr-1">Teach AI why:</span>
            {NEGATIVE_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => handleNegativeFeedback(reason)}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[10px] text-slate-300 hover:text-rose-300 border border-white/5 transition-all cursor-pointer"
              >
                {reason}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation of negative feedback learning */}
      {selectedReason && (
        <div className="text-[10px] text-slate-400 flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Learned to avoid &quot;{selectedReason}&quot; in future answers.</span>
        </div>
      )}
    </div>
  );
}
