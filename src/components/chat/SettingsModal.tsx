'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Settings as SettingsIcon,
  User,
  Shield,
  CreditCard,
  Cpu,
  Brain,
  Clock,
  Code2,
  Sparkles,
  Layers,
  Zap,
  Trash2,
  Download,
  Check,
  CheckCircle2,
  Sun,
  Moon,
  Laptop,
  AlertCircle,
  EyeOff,
  RefreshCw,
  ChevronDown,
  Volume2,
  Mic,
  Activity,
  ArrowRight,
  ShieldCheck,
  MicOff,
  Radio,
  Play,
  Square,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { UserPersonalization } from '@/lib/user-learning';
import {
  VOICE_PERSONAS,
  VoicePersona,
  speakWithPersona,
  getVoicePersona,
  normalizePersonaId,
} from '@/lib/voice-personas';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  isTemporaryChat: boolean;
  onToggleTemporaryChat: () => void;
  onExportAllChats?: () => void;
  onDeleteAllChats?: () => void;
  currentFont?: 'sans' | 'serif' | 'mono';
  onSelectChatFont?: (font: 'sans' | 'serif' | 'mono') => void;
  voiceTurnsRemaining?: number;
  onResetVoiceQuota?: () => void;
  onOpenCowork?: () => void;
}

type TabKey =
  | 'general'
  | 'voice'
  | 'personalization'
  | 'data-controls'
  | 'capabilities'
  | 'skills'
  | 'account';

export default function SettingsModal({
  isOpen,
  onClose,
  userId,
  userName = 'Meet',
  isTemporaryChat,
  onToggleTemporaryChat,
  onExportAllChats,
  onDeleteAllChats,
  currentFont = 'sans',
  onSelectChatFont,
  voiceTurnsRemaining,
  onResetVoiceQuota,
  onOpenCowork,
}: SettingsModalProps) {
  const { theme: activeNextTheme, setTheme: setNextTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings State
  const [theme, setThemeState] = useState<'system' | 'dark' | 'light'>('dark');
  const [chatFont, setChatFont] = useState<'sans' | 'serif' | 'mono'>(currentFont);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState('Executive');
  const [responseCompletions, setResponseCompletions] = useState(true);

  // Voice Agent Settings State (4 Distinct Personas: 2 Women, 2 Men)
  const [voicePersona, setVoicePersona] = useState<string>('aria-sales');
  const [voiceRate, setVoiceRate] = useState<string>('1.0');
  const [voiceAutoSpeak, setVoiceAutoSpeak] = useState<boolean>(false);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [playingPersonaId, setPlayingPersonaId] = useState<string | null>(null);

  // Microphone Permission Diagnostics State
  const [micStatus, setMicStatus] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('prompt');
  const [micTesting, setMicTesting] = useState(false);

  // Personalization & Learning State
  const [customInstructions, setCustomInstructions] = useState('');
  const [preferredTone, setPreferredTone] = useState<
    'executive_architect' | 'technical_deepdive' | 'concise_direct'
  >('executive_architect');
  const [adaptiveLearningEnabled, setAdaptiveLearningEnabled] = useState(true);
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  const [learnedPreferences, setLearnedPreferences] = useState<string[]>([
    'User prefers production-ready PostgreSQL DDL and Prisma ORM schemas over high-level summaries.',
    'User values sub-3s response latency and concrete Next.js 16 / TypeScript code examples.',
  ]);

  // Sync font from props
  useEffect(() => {
    if (currentFont) {
      setChatFont(currentFont);
    }
  }, [currentFont]);

  // Sync theme with next-themes on mount/open
  useEffect(() => {
    if (activeNextTheme === 'light' || activeNextTheme === 'dark' || activeNextTheme === 'system') {
      setThemeState(activeNextTheme);
    }
  }, [activeNextTheme, isOpen]);

  // Load user settings on open
  useEffect(() => {
    if (!isOpen) return;

    const fetchPreferences = async () => {
      try {
        const res = await fetch('/api/chat/feedback');
        if (res.ok) {
          const data: UserPersonalization = await res.json();
          if (data) {
            if (data.theme) {
              setThemeState(data.theme);
              setNextTheme(data.theme);
            }
            if (data.font) {
              setChatFont(data.font);
              onSelectChatFont?.(data.font);
            }
            setReducedMotion(data.reducedMotion || false);
            setCustomInstructions(data.customInstructions || '');
            setPreferredTone(data.preferredTone || 'executive_architect');
            setAdaptiveLearningEnabled(data.adaptiveLearningEnabled ?? true);
            setSaveChatHistory(data.saveChatHistory ?? true);
            if (Array.isArray(data.learnedPreferences)) {
              setLearnedPreferences(data.learnedPreferences);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load user preferences', err);
      }
    };

    fetchPreferences();

    // Load Voice Persona and settings
    if (typeof window !== 'undefined') {
      const savedPersona = localStorage.getItem('igg_voice_persona');
      if (savedPersona) setVoicePersona(normalizePersonaId(savedPersona));
      const savedRate = localStorage.getItem('igg_voice_rate');
      if (savedRate) setVoiceRate(savedRate);
      const savedAuto = localStorage.getItem('igg_voice_autospeak');
      if (savedAuto) setVoiceAutoSpeak(savedAuto === 'true');

      // Check browser microphone permission status
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'microphone' as PermissionName })
          .then((perm) => {
            setMicStatus(perm.state as any);
            perm.onchange = () => {
              setMicStatus(perm.state as any);
            };
          })
          .catch(() => {
            // Permissions API for microphone might not be fully supported in some browsers
          });
      }
    }
  }, [isOpen, onSelectChatFont, setNextTheme]);

  const handleApplyTheme = (newTheme: 'system' | 'dark' | 'light') => {
    setThemeState(newTheme);
    setNextTheme(newTheme);

    // Immediate DOM mutation for guaranteed instant visual update
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else if (newTheme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
      } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
          root.classList.remove('light');
          root.style.colorScheme = 'dark';
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
          root.style.colorScheme = 'light';
        }
      }
    }

    handleSavePreferences({ theme: newTheme });
  };

  const handleApplyFont = (newFont: 'sans' | 'serif' | 'mono') => {
    setChatFont(newFont);
    onSelectChatFont?.(newFont);
    if (typeof window !== 'undefined') {
      localStorage.setItem('igg_chat_font', newFont);
    }
    handleSavePreferences({ font: newFont });
  };

  const handleSavePreferences = async (overrides?: Partial<UserPersonalization>) => {
    setIsSaving(true);
    try {
      const payload: Partial<UserPersonalization> = {
        theme,
        font: chatFont,
        reducedMotion,
        customInstructions,
        preferredTone,
        adaptiveLearningEnabled,
        saveChatHistory,
        ...overrides,
      };

      const res = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-preferences',
          userId,
          preferences: payload,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (e) {
      console.error('Save failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearMemory = async () => {
    if (!confirm('Are you sure you want to clear all learned preferences?')) return;
    try {
      const res = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear-memory',
          userId,
        }),
      });
      if (res.ok) {
        setLearnedPreferences([]);
      }
    } catch (e) {
      console.error('Clear memory failed', e);
    }
  };

  const handleSaveVoiceSettings = (persona?: string, rate?: string, autoSpeak?: boolean) => {
    const nextPersona = persona ?? voicePersona;
    const nextRate = rate ?? voiceRate;
    const nextAuto = autoSpeak !== undefined ? autoSpeak : voiceAutoSpeak;

    setVoicePersona(nextPersona);
    setVoiceRate(nextRate);
    setVoiceAutoSpeak(nextAuto);

    if (typeof window !== 'undefined') {
      localStorage.setItem('igg_voice_persona', nextPersona);
      localStorage.setItem('igg_voice_rate', nextRate);
      localStorage.setItem('igg_voice_autospeak', String(nextAuto));
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleProbeMicrophone = async () => {
    setMicTesting(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicStatus('denied');
        setMicTesting(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('granted');
      stream.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.warn('Microphone permission probe failed', err);
      setMicStatus('denied');
    } finally {
      setMicTesting(false);
    }
  };

  const handleTestVoice = (targetPersonaId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    const personaIdToUse = targetPersonaId || voicePersona;
    const persona = getVoicePersona(personaIdToUse);

    // If already playing this persona, cancel it
    if (playingPersonaId === persona.id && isTestingVoice) {
      window.speechSynthesis.cancel();
      setPlayingPersonaId(null);
      setIsTestingVoice(false);
      return;
    }

    setPlayingPersonaId(persona.id);
    setIsTestingVoice(true);

    const userRateNum = parseFloat(voiceRate) || 1.0;
    speakWithPersona({
      text: persona.sampleText,
      personaId: persona.id,
      userRate: userRateNum,
      onStart: () => {
        setIsTestingVoice(true);
        setPlayingPersonaId(persona.id);
      },
      onEnd: () => {
        setIsTestingVoice(false);
        setPlayingPersonaId(null);
      },
      onError: () => {
        setIsTestingVoice(false);
        setPlayingPersonaId(null);
      },
    });
  };

  if (!isOpen) return null;

  const navigationItems = [
    { section: 'Settings', items: [
      { id: 'general', label: 'General', icon: SettingsIcon },
      { id: 'voice', label: 'Voice Agent & Speech', icon: Volume2, badge: 'Interactive' },
      { id: 'personalization', label: 'Memory & Personalization', icon: Brain, badge: `${learnedPreferences.length}` },
      { id: 'data-controls', label: 'Data Controls & Privacy', icon: Shield },
      { id: 'account', label: 'Account', icon: User },
      { id: 'capabilities', label: 'Capabilities & Models', icon: Cpu },
    ]},
    { section: 'Customize', items: [
      { id: 'skills', label: 'Active Skills', icon: Sparkles, badge: 'Enterprise' },
    ]}
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window Container - Matches Claude/ChatGPT Reference Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl h-[640px] max-h-[90vh] bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 transition-colors duration-200"
        >
          {/* Close Button Top Right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-[#0d1017] border-r border-slate-200 dark:border-white/5 p-4 flex flex-col shrink-0">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-none">
              {navigationItems.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {group.section}
                  </div>
                  {group.items
                    .filter((item) =>
                      item.label.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id as TabKey)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* User Profile Mini Card in Sidebar */}
            <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                  {userName[0]?.toUpperCase() || 'M'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-medium text-slate-900 dark:text-white truncate">{userName}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Enterprise Pro</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Content Pane */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
            {/* TAB: GENERAL (Image 3 appearance layout) */}
            {activeTab === 'general' && (
              <div className="space-y-8 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Appearance</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Customize the visual theme, typography, and motion of InGrowwth AI Studio.</p>
                </div>

                {/* Theme Selector - Fully Functional Next-Themes Switcher */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Theme</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Choose studio appearance</div>
                  </div>
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => handleApplyTheme('system')}
                      className={`p-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                        theme === 'system'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">System</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTheme('light')}
                      className={`p-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTheme('dark')}
                      className={`p-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Dark</span>
                    </button>
                  </div>
                </div>

                {/* Chat Font - Custom Styled Dropdown with inset Chevron (Fixed Edge Arrow Bug) */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Chat Font</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Typography style for AI architectural outputs</div>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={chatFont}
                      onChange={(e) => {
                        const f = e.target.value as 'sans' | 'serif' | 'mono';
                        handleApplyFont(f);
                      }}
                      className="w-full appearance-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-3.5 pr-10 py-2 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 cursor-pointer font-medium"
                    >
                      <option value="sans" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Modern Sans (Inter)</option>
                      <option value="serif" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Editorial Serif (Claude)</option>
                      <option value="mono" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Technical Mono (Geist)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Motion */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Motion</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Reduce animation in streaming responses and interface elements</div>
                  </div>
                  <div className="flex items-center p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                    <button
                      type="button"
                      onClick={() => { setReducedMotion(false); handleSavePreferences({ reducedMotion: false }); }}
                      className={`p-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer ${
                        !reducedMotion ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Smooth
                    </button>
                    <button
                      type="button"
                      onClick={() => { setReducedMotion(true); handleSavePreferences({ reducedMotion: true }); }}
                      className={`p-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer ${
                        reducedMotion ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Reduced
                    </button>
                  </div>
                </div>

                {/* Voice & Synthesis - Fixed Edge Arrow Bug */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Speech &amp; Audio</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">Consultant Style</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Tone cadence during voice discovery meetings</div>
                      </div>
                      <div className="relative min-w-[200px]">
                        <select
                          value={voiceStyle}
                          onChange={(e) => setVoiceStyle(e.target.value)}
                          className="w-full appearance-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-3.5 pr-10 py-2 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 cursor-pointer font-medium"
                        >
                          <option value="Executive" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Executive (Confident)</option>
                          <option value="Buttery" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Warm &amp; Natural</option>
                          <option value="Technical" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Technical &amp; Direct</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Notifications</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">Response completions</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Get notified when long-running architecture syntheses finish</div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setResponseCompletions(!responseCompletions)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        responseCompletions ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/10'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          responseCompletions ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PERSONALIZATION & MEMORY (RLHF Feedback Learning) */}
            {activeTab === 'personalization' && (
              <div className="space-y-8 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Memory &amp; Personalization
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    InGrowwth AI continuously learns your engineering preferences from thumbs-up &amp; thumbs-down feedback.
                  </p>
                </div>

                {/* Adaptive RLHF Learning Toggle */}
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        Adaptive Learning from Feedback
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        When you give positive feedback, the AI reinforces your preferred architecture styles. When negative feedback is given, it adapts to avoid unsatisfactory patterns.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !adaptiveLearningEnabled;
                        setAdaptiveLearningEnabled(next);
                        handleSavePreferences({ adaptiveLearningEnabled: next });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        adaptiveLearningEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          adaptiveLearningEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Live Learned Preferences List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Learned Preferences ({learnedPreferences.length})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-mono">
                        Active RLHF Memory
                      </span>
                    </div>
                    {learnedPreferences.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearMemory}
                        className="text-[11px] text-rose-500 hover:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear Memory
                      </button>
                    )}
                  </div>

                  {learnedPreferences.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">
                      No learned preferences yet. Rate responses with 👍 or 👎 in chat to teach the AI.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {learnedPreferences.map((pref, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5 shrink-0" />
                          <span className="flex-1">{pref}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Custom System Instructions */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Custom Architectural Instructions
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    What would you like the InGrowwth AI to know about your stack, coding conventions, or enterprise constraints?
                  </p>
                  <textarea
                    rows={3}
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="e.g. Always generate PostgreSQL DDL with UUID v4 primary keys, use Prisma syntax, write Next.js 16 App Router code..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Preferred Response Tone - Fixed Dropdown Edge Bug */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Preferred Tone</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Consultant communication style</div>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={preferredTone}
                      onChange={(e) => {
                        const t = e.target.value as any;
                        setPreferredTone(t);
                      }}
                      className="w-full appearance-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-3.5 pr-10 py-2 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 cursor-pointer font-medium"
                    >
                      <option value="executive_architect" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Executive Principal Architect</option>
                      <option value="technical_deepdive" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Technical Deep-Dive (Code-Heavy)</option>
                      <option value="concise_direct" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">Concise &amp; Direct</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSavePreferences()}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : saveSuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : null}
                    <span>{saveSuccess ? 'Preferences Saved' : 'Save Personalization'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: VOICE AGENT & SPEECH CONTROLS */}
            {activeTab === 'voice' && (
              <div className="space-y-8 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Voice Agent &amp; Speech Controls
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Configure the neural persona, cadence, and access quotas for the InGrowwth Voice Agent.
                  </p>
                </div>

                {/* Quota & Access Level Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Simple Chat Quota Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Simple Chat Quota</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold">
                        3 Turns / Session
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Simple chat includes 3 voice interactions to test real-time architectural output.
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
                      <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300">
                        Remaining: <strong className="text-indigo-600 dark:text-indigo-400">{voiceTurnsRemaining ?? 3}</strong> / 3
                      </span>
                      {onResetVoiceQuota && (
                        <button
                          type="button"
                          onClick={onResetVoiceQuota}
                          className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Reset Demo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cowork Studio Unlimited Access Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Cowork Studio
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold">
                        Unlimited VIP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Continuous hands-free bidirectional reasoning with 24/7 background Dots orchestration.
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ● Zero Cooldown
                      </span>
                      {onOpenCowork && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenCowork();
                          }}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Cowork</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Voice Persona Selector - 4 Distinct Personas (2 Women, 2 Men) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        Voice Agent Personas &amp; Roles
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        2 Women &amp; 2 Men with distinct pitch, timbre, and specialized organizational roles
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                      4 Neural Voices
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {VOICE_PERSONAS.map((persona) => {
                      const isSelected = voicePersona === persona.id;
                      const isPlaying = playingPersonaId === persona.id && isTestingVoice;

                      return (
                        <div
                          key={persona.id}
                          className={`p-3.5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-indigo-50/80 dark:bg-indigo-500/15 border-indigo-500 text-slate-900 dark:text-slate-100 shadow-sm'
                              : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/5'
                          }`}
                        >
                          <div>
                            {/* Header: Name, Gender & Selected Check */}
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {persona.name}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                    persona.gender === 'Female'
                                      ? 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/20'
                                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  }`}
                                >
                                  {persona.gender}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {isSelected ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30">
                                    <Check className="w-3 h-3" />
                                    Active
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSaveVoiceSettings(persona.id, undefined, undefined)}
                                    className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline cursor-pointer"
                                  >
                                    Select
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Role Title */}
                            <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
                              {persona.role}
                            </div>

                            {/* Vibe & Description */}
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                              {persona.vibe}
                            </div>
                          </div>

                          {/* Quick Listen Sample Button */}
                          <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Pitch: {persona.basePitch}x
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestVoice(persona.id);
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                isPlaying
                                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30 animate-pulse'
                                  : 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white'
                              }`}
                            >
                              {isPlaying ? (
                                <>
                                  <Square className="w-3 h-3 fill-current" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Listen Sample</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Microphone Hardware & Permissions Diagnostic Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          micStatus === 'granted'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : micStatus === 'denied'
                            ? 'bg-rose-500/15 text-rose-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {micStatus === 'granted' ? (
                          <Mic className="w-4 h-4" />
                        ) : (
                          <MicOff className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Microphone Permission &amp; Hardware
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {micStatus === 'granted'
                            ? 'Microphone is active and permitted for voice commands'
                            : micStatus === 'denied'
                            ? 'Access is blocked by browser site permissions or macOS'
                            : 'Click below to test and request microphone access'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                          micStatus === 'granted'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : micStatus === 'denied'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {micStatus === 'granted'
                          ? 'Allowed'
                          : micStatus === 'denied'
                          ? 'Denied'
                          : 'Not Tested'}
                      </span>
                    </div>
                  </div>

                  {/* Troubleshooting steps when denied */}
                  {micStatus === 'denied' && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-800 dark:text-rose-300 space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-200">
                        <AlertCircle className="w-4 h-4" />
                        How to unblock Microphone access:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-rose-700 dark:text-rose-300/90 leading-relaxed">
                        <li>
                          <strong>In Browser URL bar:</strong> Click the Tune/Padlock icon next to the URL <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">localhost:3000</code> and switch <strong>Microphone</strong> from <em>Block</em> to <strong>Allow</strong>.
                        </li>
                        <li>
                          <strong>In macOS System Settings:</strong> Open <em>System Settings → Privacy &amp; Security → Microphone</em> and ensure your browser has the switch turned <strong>ON</strong>.
                        </li>
                      </ol>
                    </div>
                  )}

                  {/* Test button */}
                  <div className="pt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleProbeMicrophone}
                      disabled={micTesting}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {micTesting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing Hardware...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Test / Request Microphone Permission</span>
                        </>
                      )}
                    </button>

                    {micStatus === 'granted' && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hardware Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Cadence / Speaking Rate - Fixed Dropdown Edge bug */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Speaking Rate Multiplier</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Audio playback cadence &amp; pace</div>
                  </div>
                  <div className="relative min-w-[180px]">
                    <select
                      value={voiceRate}
                      onChange={(e) => handleSaveVoiceSettings(undefined, e.target.value, undefined)}
                      className="w-full appearance-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-3.5 pr-10 py-2 text-xs text-slate-900 dark:text-slate-200 outline-none focus:border-indigo-500 cursor-pointer font-medium"
                    >
                      <option value="0.8" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">0.8x (Deliberate)</option>
                      <option value="1.0" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">1.0x (Standard Natural)</option>
                      <option value="1.2" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">1.2x (Fast Executive)</option>
                      <option value="1.4" className="bg-white dark:bg-[#14171f] text-slate-900 dark:text-slate-100">1.4x (High Velocity)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Auto-Speak Responses Toggle */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Auto-Speak Responses</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Automatically read assistant solutions aloud using active persona
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveVoiceSettings(undefined, undefined, !voiceAutoSpeak)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      voiceAutoSpeak ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/10'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        voiceAutoSpeak ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Active Persona Briefing Player */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Active Persona Briefing</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Audition <strong>{getVoicePersona(voicePersona).name}</strong> ({getVoicePersona(voicePersona).role}) at {voiceRate}x speed
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTestVoice()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-600/25"
                  >
                    {isTestingVoice ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-bounce" />
                        <span>Speaking...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Sample</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Voice Commands Cheat Sheet */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Hands-Free Voice Commands Recognized</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <strong className="text-indigo-600 dark:text-indigo-400">"Open Cowork"</strong>
                      <div className="text-[10px] text-slate-500 mt-0.5">Launches Cowork Studio</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <strong className="text-indigo-600 dark:text-indigo-400">"Open Settings"</strong>
                      <div className="text-[10px] text-slate-500 mt-0.5">Launches configuration</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <strong className="text-indigo-600 dark:text-indigo-400">"Schedule Meeting"</strong>
                      <div className="text-[10px] text-slate-500 mt-0.5">Books discovery consultation</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <strong className="text-indigo-600 dark:text-indigo-400">"Send"</strong>
                      <div className="text-[10px] text-slate-500 mt-0.5">Submits query immediately</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DATA CONTROLS & PRIVACY (Image 1 ChatGPT-Style Data Controls) */}
            {activeTab === 'data-controls' && (
              <div className="space-y-8 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Data Controls &amp; Incognito Privacy
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage session saving, Incognito temporary chats, and historical consultation export.
                  </p>
                </div>

                {/* Incognito / Temporary Chat Toggle Card */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-white/[0.02] border border-purple-200 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <EyeOff className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Temporary Chat (Incognito Mode)</span>
                          {isTemporaryChat && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono">
                              Active Now
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          When enabled, your queries and architectural searches are not saved in consultation history, nor stored in database or memory.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onToggleTemporaryChat}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                        isTemporaryChat ? 'bg-purple-600' : 'bg-slate-300 dark:bg-white/10'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isTemporaryChat ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Save Chat History Toggle */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/5">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Save chat history</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mt-0.5">
                      Save new chats to this browser and your account for session restoration and audit compliance.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !saveChatHistory;
                      setSaveChatHistory(next);
                      handleSavePreferences({ saveChatHistory: next });
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      saveChatHistory ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/10'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        saveChatHistory ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Export & Delete Actions */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Manage Consultation Archives</div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {onExportAllChats && (
                      <button
                        type="button"
                        onClick={onExportAllChats}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-medium"
                      >
                        <Download className="w-4 h-4 text-indigo-500" />
                        <span>Export All Consultations</span>
                      </button>
                    )}

                    {onDeleteAllChats && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete all saved consultation sessions?')) {
                            onDeleteAllChats();
                          }
                        }}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-300 transition-all cursor-pointer font-medium"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                        <span>Delete All Chats</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CAPABILITIES & MODELS */}
            {activeTab === 'capabilities' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    Autonomous AI Models
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Powered by dual-tier edge reasoning, local Qwen 14B Coder, and accelerated Cloud synthesis.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-indigo-500/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">IGG Architect Pro (Flagship)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          Active (~2.4s Latency)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Enterprise System Design, Full-Stack Architecture, PostgreSQL DDL schemas, and Prisma ORM models.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-500 dark:text-purple-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">IGG Deep Reasoning</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                          Local 14B Qwen / DeepSeek
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Multi-step algorithmic logic, mathematical proofs, edge-case analysis with visible thinking traces.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-500 dark:text-cyan-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">IGG Flash Turbo</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                          Sub-300ms
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Instant architectural triage, query routing, and conversational response acceleration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SKILLS & BENCHMARKS */}
            {activeTab === 'skills' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    InGrowwth Enterprise Skills &amp; Benchmarks
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Attached domain intelligence packs powering our consultant engine.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: 'database-schema-architect',
                      title: 'Database Schema Architect',
                      desc: 'Enterprise PostgreSQL DDL generation, Prisma ORM schemas, multi-tenant row-level security & indexing benchmarks.',
                      badge: 'Active Benchmark',
                    },
                    {
                      name: 'ui-ux-pro-max',
                      title: 'UI/UX Pro Max Design Intelligence',
                      desc: '79 active design styles, token architecture, responsive layouts, and Tailwind design patterns.',
                      badge: 'Attached',
                    },
                    {
                      name: 'brand-identity',
                      title: 'InGrowwth Innovations Corporate Identity',
                      desc: 'Voice guidelines, IT consulting solutions, startup MVP velocity, and professional tone standards.',
                      badge: 'Attached',
                    },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{skill.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{skill.desc}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/30">
                        {skill.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ACCOUNT */}
            {activeTab === 'account' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Account &amp; Organization</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage user identity, subscription tier, and enterprise security.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                      {userName[0]?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{userName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">User ID: {userId || 'usr_enterprise_007'}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Plan:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">InGrowwth Enterprise Founder</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Data Isolation:</span>
                    <span className="text-indigo-600 dark:text-indigo-300 font-mono">Tenant Zero-Knowledge</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
