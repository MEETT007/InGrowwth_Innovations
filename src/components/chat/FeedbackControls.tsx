'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackControls({ messageId }: { messageId: string }) {
  const [feedback, setFeedback] = useState<'UP' | 'DOWN' | null>(null);

  const handleFeedback = (type: 'UP' | 'DOWN') => {
    setFeedback(type);
    // In production, dispatch this to the ObservabilityManager for Eval tracking
    console.log(`[Feedback] Message ${messageId} rated ${type}`);
  };

  return (
    <div className="flex items-center space-x-2 mt-4 pt-2 border-t border-gray-800/50">
      <span className="text-xs text-gray-500 font-medium">Was this helpful?</span>

      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex space-x-1"
          >
            <button
              onClick={() => handleFeedback('UP')}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-green-400 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFeedback('DOWN')}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-red-400 transition-colors"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs text-blue-400 font-medium ml-2"
          >
            Thanks for your feedback!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
