'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  X,
  Sliders,
  Laptop,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
}

export default function MicrophonePermissionModal({
  isOpen,
  onClose,
  onPermissionGranted,
}: MicrophonePermissionModalProps) {
  const [testingStatus, setTestingStatus] = useState<
    'idle' | 'testing' | 'granted' | 'denied'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTestMicrophone = async () => {
    setTestingStatus('testing');
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setTestingStatus('denied');
        setErrorMessage('Media devices API is not supported in this browser environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Successfully obtained stream!
      setTestingStatus('granted');
      // Stop all tracks so we don't leave the recording indicator on
      stream.getTracks().forEach((track) => track.stop());

      if (onPermissionGranted) {
        setTimeout(() => {
          onPermissionGranted();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.warn('Microphone permission test failed', err);
      setTestingStatus('denied');
      setErrorMessage(
        err.message ||
          'Microphone permission is currently blocked in browser site permissions or macOS system settings.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative max-w-lg w-full bg-white dark:bg-[#12151e] border border-slate-200 dark:border-rose-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 space-y-6 z-10"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-500">
              <MicOff className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Microphone Access is Denied
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your browser or operating system has blocked microphone input for InGrowwth AI Studio.
              </p>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              How to enable in 2 quick steps:
            </div>

            {/* Step 1: Browser Site Permissions */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>In Your Browser Address Bar</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                Click the <strong>Tune / Padlock icon</strong> (site information) at the left of the URL bar (next to <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-[11px]">localhost:3000</code>). Look for <strong>Microphone</strong> and toggle it from <em>Block</em> to <strong>Allow</strong>.
              </p>
            </div>

            {/* Step 2: macOS System Settings */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>In macOS System Settings</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                Open <strong>System Settings → Privacy &amp; Security → Microphone</strong>. Ensure your browser (e.g. <em>Google Chrome</em>) has the toggle switch turned <strong>ON</strong>.
              </p>
            </div>
          </div>

          {/* Test Status Indicator */}
          {testingStatus === 'granted' && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Success! Microphone permission granted. Voice commands and dictation are now ready.</span>
            </div>
          )}

          {testingStatus === 'denied' && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Microphone still blocked:</span>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 block">
                  {errorMessage || 'Please ensure you changed the setting to Allow and re-test below.'}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleTestMicrophone}
              disabled={testingStatus === 'testing'}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {testingStatus === 'testing' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Probing Audio Hardware...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Test Microphone Permission Now</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
