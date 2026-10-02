'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  User,
  Plus,
  FileText,
  ArrowUp,
  Search,
  BrainCircuit,
  Sparkles,
  BookOpen,
  Code,
  PenTool,
  Layers,
  PanelLeft,
  Download,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  EyeOff,
  Sun,
  Settings as SettingsIcon,
  Mic,
  Activity,
  Calendar,
  Database,
  Terminal,
  Shield,
  ShieldCheck,
  Rocket,
  Lock,
  Volume2,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useUser } from '@clerk/nextjs';
import ChatSidebar, { ChatSessionItem, AVAILABLE_MODELS } from './ChatSidebar';
import {
  ChatStorage,
  ProjectItem,
  FolderItem,
  StoredSessionItem,
} from '@/lib/chat-storage';
import CodeBlock from './CodeBlock';
import ThinkingProcess from './ThinkingProcess';
import InteractiveMessage from './InteractiveMessage';
import FeedbackControls from './FeedbackControls';
import SettingsModal from './SettingsModal';
import HandoffCard from './HandoffCard';
import CoworkWorkspace, { AUTHORIZED_COWORK_EMAILS } from './CoworkWorkspace';
import MicrophonePermissionModal from './MicrophonePermissionModal';
import {
  speakWithPersona,
  getVoicePersona,
  normalizePersonaId,
} from '@/lib/voice-personas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  userQuery?: string;
  interactiveData?: Record<string, unknown>;
  requiresHandoff?: boolean;
  handoffReason?: string;
  isStreaming?: boolean;
  modelUsed?: string;
  latencyMs?: number;
  thinkingSteps?: Array<{ label: string; duration?: string }>;
  reasoningTrace?: string;
}

export default function ChatWorkspace() {
  const { user } = useUser();
  const userId = user?.id;
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userName = user?.firstName || 'Meet';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('igg-architect-pro');
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);
  const [chatFont, setChatFont] = useState<'sans' | 'serif' | 'mono'>('sans');

  // Projects & Folders Workspace State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-default');

  const [sessions, setSessions] = useState<ChatSessionItem[]>([
    {
      id: 'session-default',
      title: 'Current Architecture Consultation',
      timestamp: 'Just now',
      updatedAt: Date.now(),
      projectId: 'proj-default',
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-default');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [reasonEnabled, setReasonEnabled] = useState(true);

  // Interaction Mode: 'chat' vs 'cowork'
  const [interactionMode, setInteractionMode] = useState<'chat' | 'cowork'>('chat');
  const [showCoworkPaywall, setShowCoworkPaywall] = useState(false);

  // Voice Dictation (Mic) State
  const [isListening, setIsListening] = useState(false);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baseInputRef = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');

  // Voice Agent State (3 free turns in Simple Chat, Unlimited in Cowork)
  const [voiceTurnsRemaining, setVoiceTurnsRemaining] = useState<number>(3);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [showVoiceLimitModal, setShowVoiceLimitModal] = useState<boolean>(false);
  const [voiceFeedbackToast, setVoiceFeedbackToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate Projects, Folders, and Sessions from LocalStorage (Dual-Layer Resilience)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProjects = ChatStorage.getProjects();
      const storedFolders = ChatStorage.getFolders();
      const storedSessions = ChatStorage.getSessions();

      setProjects(storedProjects);
      setFolders(storedFolders);
      if (storedProjects.length > 0) {
        setActiveProjectId(storedProjects[0].id);
      }
      if (storedSessions.length > 0) {
        setSessions(storedSessions);
        const initialSessionId = storedSessions[0].id;
        setActiveSessionId(initialSessionId);
        const localMsgs = ChatStorage.getSessionMessages(initialSessionId);
        if (localMsgs.length > 0) {
          setMessages(localMsgs);
        }
      }

      const savedFont = localStorage.getItem('igg_chat_font') as 'sans' | 'serif' | 'mono' | null;
      if (savedFont) {
        setChatFont(savedFont);
      }
      const savedTurns = localStorage.getItem('igg_voice_turns_chat');
      if (savedTurns !== null) {
        setVoiceTurnsRemaining(parseInt(savedTurns, 10));
      }
    }
  }, []);

  // Time of day greeting (Image 2 Claude style) - Capitalized Afternoon
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${userName}`;
    if (hour < 17) return `Good Afternoon, ${userName}`;
    return `Good Evening, ${userName}`;
  }, [userName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Load user sessions list from API & merge with LocalStorage
  const refreshSessions = async () => {
    try {
      const res = await fetch(`/api/chat/sessions${userId ? `?userId=${userId}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const localSessions = ChatStorage.getSessions();
          const localMap = new Map(localSessions.map((s) => [s.id, s]));
          data.forEach((serverSession: any) => {
            if (!localMap.has(serverSession.id)) {
              localMap.set(serverSession.id, {
                id: serverSession.id,
                title: serverSession.title,
                timestamp: serverSession.timestamp || 'Recent',
                updatedAt: serverSession.updatedAt || Date.now(),
                projectId: serverSession.projectId || activeProjectId || 'proj-default',
                folderId: serverSession.folderId || null,
              });
            }
          });
          const merged = Array.from(localMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
          setSessions(merged);
          ChatStorage.saveSessions(merged);
        }
      }
    } catch (e) {
      console.error('Failed to load session list', e);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, [userId]);

  // Load chat history for the active session (Instant local + background server sync)
  const loadSessionMessages = async (sessionId: string) => {
    if (isTemporaryChat) return;

    // 1. Instant local load
    const cached = ChatStorage.getSessionMessages(sessionId);
    if (cached.length > 0) {
      setMessages(cached);
    }

    // 2. Fetch from server to sync
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const loaded: Message[] = data.map((msg: any) => ({
            id: msg.id || Date.now().toString(),
            role: msg.role,
            content: msg.content,
            interactiveData: msg.interactiveData,
            requiresHandoff: msg.interactiveData?.type === 'HANDOFF',
            handoffReason: (msg.interactiveData?.reason as string) || undefined,
          }));
          setMessages(loaded);
          ChatStorage.saveSessionMessages(sessionId, loaded);
        }
      }
    } catch (e) {
      console.error('Failed to load session history', e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 180)}px`;
    }
  }, [inputValue]);

  // Voice Dictation (Mic) & Voice Commands Handler
  const toggleListening = async () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      // Explicit microphone permission request so browser doesn't fail silently
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr) {
          console.warn('Microphone permission denied', permErr);
          setShowMicPermissionModal(true);
          return;
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Snapshot base text so speech recognition appends cleanly without stuttering or repeating
      baseInputRef.current = inputValue.trim();
      finalTranscriptRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedbackToast('🎙️ Listening... (Say "Open Cowork", "Schedule Meeting", or dictate query)');
        setTimeout(() => setVoiceFeedbackToast(null), 4000);
      };

      recognition.onresult = (event: any) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Only append final chunk once
            finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + chunk.trim();
          } else {
            interim = chunk.trim();
          }
        }

        const combinedSpoken = [finalTranscriptRef.current, interim].filter(Boolean).join(' ').trim();
        const lower = combinedSpoken.toLowerCase();

        // 1. Voice Command: Open Cowork Studio
        if (
          lower.includes('open cowork') ||
          lower.includes('switch to cowork') ||
          lower.includes('go to cowork') ||
          lower.includes('cowork mode')
        ) {
          recognition.stop();
          setIsListening(false);
          setVoiceFeedbackToast('⚡ Voice command recognized: Opening Cowork Studio...');
          handleSelectInteractionMode('cowork');
          return;
        }

        // 2. Voice Command: Open Settings
        if (
          lower.includes('open settings') ||
          lower.includes('show settings') ||
          lower.includes('voice settings')
        ) {
          recognition.stop();
          setIsListening(false);
          setVoiceFeedbackToast('⚡ Voice command recognized: Opening Settings...');
          setSettingsOpen(true);
          return;
        }

        // 3. Voice Command: Schedule Meeting
        if (
          lower.includes('schedule meeting') ||
          lower.includes('book meeting') ||
          lower.includes('schedule a call')
        ) {
          setInputValue('I would like to schedule a technical discovery consultation with the InGrowwth Innovations engineering team.');
          setVoiceFeedbackToast('⚡ Voice command: Scheduling technical discovery meeting...');
          return;
        }

        // 4. Voice Command: Send Message
        if (lower === 'send' || lower === 'send message' || lower === 'submit query') {
          recognition.stop();
          setIsListening(false);
          handleSend();
          return;
        }

        // Set input cleanly: base text + accurate spoken text (no multi-repeats)
        const nextInput = [baseInputRef.current, combinedSpoken].filter(Boolean).join(' ').trim();
        setInputValue(nextInput);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setShowMicPermissionModal(true);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed', err);
      setIsListening(false);
      setShowMicPermissionModal(true);
    }
  };

  // Interactive Voice Agent Output (Button Next to Mic)
  const handleToggleVoiceAgent = () => {
    if (typeof window === 'undefined') return;

    // If currently speaking, stop it
    if (isVoiceSpeaking) {
      window.speechSynthesis?.cancel();
      setIsVoiceSpeaking(false);
      setVoiceFeedbackToast('Voice playback stopped.');
      setTimeout(() => setVoiceFeedbackToast(null), 2000);
      return;
    }

    // Check quota for Simple Chat (3 free turns per session)
    if (voiceTurnsRemaining <= 0) {
      setShowVoiceLimitModal(true);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Load active persona and cadence settings
    const savedPersonaId = localStorage.getItem('igg_voice_persona') || 'aria-sales';
    const persona = getVoicePersona(savedPersonaId);
    const savedRate = localStorage.getItem('igg_voice_rate') || '1.0';
    const rateMultiplier = parseFloat(savedRate) || 1.0;

    // Get latest assistant response or introductory greeting
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
    let textToSpeak = '';

    if (lastAssistantMsg) {
      textToSpeak = lastAssistantMsg.content
        .replace(/```[\s\S]*?```/g, 'Code snippet omitted for audio briefing.')
        .replace(/[#*`_\[\]()>-]/g, '')
        .slice(0, 450);
    } else {
      textToSpeak = `Hello ${userName}. I am ${persona.name}, your ${persona.role}. You have ${voiceTurnsRemaining} simple chat turns remaining. Switch to Cowork Studio for unlimited turns, multi-agent execution, and 24/7 background AI Dots.`;
    }

    // Decrement turn quota
    const newQuota = Math.max(0, voiceTurnsRemaining - 1);
    setVoiceTurnsRemaining(newQuota);
    localStorage.setItem('igg_voice_turns_chat', String(newQuota));

    setIsVoiceSpeaking(true);
    setVoiceFeedbackToast(`🎙️ ${persona.name} (${persona.role}) Speaking (${newQuota} turns left)`);

    speakWithPersona({
      text: textToSpeak,
      personaId: persona.id,
      userRate: rateMultiplier,
      onStart: () => {
        setIsVoiceSpeaking(true);
        setVoiceFeedbackToast(`🎙️ ${persona.name} (${persona.role}) Speaking (${newQuota} turns left)`);
      },
      onEnd: () => {
        setIsVoiceSpeaking(false);
        setVoiceFeedbackToast(null);
      },
      onError: () => {
        setIsVoiceSpeaking(false);
        setVoiceFeedbackToast(null);
      },
    });
  };

  const handleResetVoiceQuota = () => {
    setVoiceTurnsRemaining(3);
    if (typeof window !== 'undefined') {
      localStorage.setItem('igg_voice_turns_chat', '3');
    }
    setVoiceFeedbackToast('Voice quota reset to 3 free turns.');
    setTimeout(() => setVoiceFeedbackToast(null), 3000);
  };

  // Cowork Mode Click Handler with VIP check
  const handleSelectInteractionMode = (mode: 'chat' | 'cowork') => {
    if (mode === 'cowork') {
      const normalizedEmail = (userEmail || '').toLowerCase().trim();
      const normalizedName = (userName || '').toLowerCase().trim();

      const isAllowed =
        AUTHORIZED_COWORK_EMAILS.some((e) => e === normalizedEmail) ||
        normalizedName.includes('meet') ||
        normalizedName.includes('darshan') ||
        normalizedName.includes('saurav');

      if (isAllowed) {
        setInteractionMode('cowork');
      } else {
        setShowCoworkPaywall(true);
      }
    } else {
      setInteractionMode('chat');
    }
  };

  const handleNewChat = (targetProjectId?: string, targetFolderId?: string | null) => {
    const projId = targetProjectId || activeProjectId || 'proj-default';
    if (!isTemporaryChat) {
      const newSession = ChatStorage.createSession('New Consultation', projId, targetFolderId || null);
      setSessions(ChatStorage.getSessions());
      setActiveSessionId(newSession.id);
    } else {
      const tempId = `temp-${Date.now()}`;
      setActiveSessionId(tempId);
    }
    setMessages([]);
    setInputValue('');
    setUploadedFiles([]);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectSession = (id: string) => {
    if (isTemporaryChat) {
      if (confirm('Exit Incognito Temporary Chat to open saved consultation?')) {
        setIsTemporaryChat(false);
      } else {
        return;
      }
    }
    setActiveSessionId(id);
    loadSessionMessages(id);
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    ChatStorage.renameSession(id, newTitle);
    setSessions(ChatStorage.getSessions());
    try {
      await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: id, title: newTitle }),
      });
    } catch (e) {
      console.error('Rename session error', e);
    }
  };

  const handleMoveSession = (id: string, targetProjectId: string, targetFolderId: string | null) => {
    ChatStorage.moveSession(id, targetProjectId, targetFolderId);
    setSessions(ChatStorage.getSessions());
    fetch('/api/chat/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: id,
        title: sessions.find((s) => s.id === id)?.title || 'Consultation',
        projectId: targetProjectId,
        folderId: targetFolderId,
      }),
    }).catch(() => {});
  };

  const handleDeleteSession = async (id: string) => {
    ChatStorage.deleteSession(id);
    setSessions(ChatStorage.getSessions());
    try {
      await fetch(`/api/chat/sessions?sessionId=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Delete session error', e);
    }
    if (activeSessionId === id) {
      handleNewChat();
    }
  };

  // Projects Handlers
  const handleCreateProject = (name: string, color?: string) => {
    const created = ChatStorage.createProject(name, color);
    const updated = ChatStorage.getProjects();
    setProjects(updated);
    setActiveProjectId(created.id);
  };

  const handleRenameProject = (id: string, newName: string) => {
    ChatStorage.renameProject(id, newName);
    setProjects(ChatStorage.getProjects());
  };

  const handleDeleteProject = (id: string) => {
    ChatStorage.deleteProject(id);
    const updated = ChatStorage.getProjects();
    setProjects(updated);
    if (activeProjectId === id && updated[0]) {
      setActiveProjectId(updated[0].id);
    }
  };

  // Folders Handlers
  const handleCreateFolder = (name: string, projectId: string) => {
    ChatStorage.createFolder(name, projectId);
    setFolders(ChatStorage.getFolders());
  };

  const handleRenameFolder = (id: string, newName: string) => {
    ChatStorage.renameFolder(id, newName);
    setFolders(ChatStorage.getFolders());
  };

  const handleDeleteFolder = (id: string) => {
    ChatStorage.deleteFolder(id);
    setFolders(ChatStorage.getFolders());
    setSessions(ChatStorage.getSessions());
  };

  const handleToggleFolder = (id: string) => {
    ChatStorage.toggleFolderExpanded(id);
    setFolders(ChatStorage.getFolders());
  };

  const handleToggleTemporaryChat = () => {
    const nextState = !isTemporaryChat;
    setIsTemporaryChat(nextState);
    if (nextState) {
      setActiveSessionId(`temp-${Date.now()}`);
      setMessages([]);
    } else {
      handleNewChat();
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map(
        (m) =>
          `### ${m.role === 'user' ? '👤 User' : '🤖 InGrowwth AI Architect'}\n\n${m.content}\n\n---`
      )
      .join('\n\n');
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingrowwth-consultation-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllChats = async () => {
    setSessions([]);
    setMessages([]);
    handleNewChat();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setShowUploadAnimation(true);
    setTimeout(() => {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
      setShowUploadAnimation(false);
    }, 600);
  };

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || inputValue;
    if (!textToSend.trim() && uploadedFiles.length === 0) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setInputValue('');
    setIsProcessing(true);

    let contentStr = textToSend;
    if (uploadedFiles.length > 0) {
      contentStr = `[Attached: ${uploadedFiles.map((f) => f.name).join(', ')}] ` + contentStr;
    }

    const currentTitle = textToSend.slice(0, 36) + (textToSend.length > 36 ? '...' : '');

    // Only update session title in sidebar if not in temporary chat
    if (!isTemporaryChat) {
      ChatStorage.renameSession(activeSessionId, currentTitle);
      setSessions(ChatStorage.getSessions());
      fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          title: currentTitle,
          projectId: activeProjectId,
        }),
      }).catch(() => {});
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: contentStr || 'Analyze architectural requirements',
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];
      if (!isTemporaryChat) {
        ChatStorage.saveSessionMessages(activeSessionId, updated);
      }
      return updated;
    });
    setUploadedFiles([]);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: isTemporaryChat ? `temp-${Date.now()}` : (activeSessionId || userId || 'guest-session'),
          query: contentStr || 'Analyze attached specifications',
          model: selectedModel,
          reasoning: reasonEnabled,
          webSearch: searchEnabled,
          isTemporary: isTemporaryChat,
        }),
      });

      const data = await response.json();
      const latency = Date.now() - startTime;
      const fullText = data.text || 'Unable to generate response. Please check server logs.';

      // Assistant message with streaming animation
      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          userQuery: contentStr,
          isStreaming: true,
          modelUsed: selectedModel,
          latencyMs: latency,
          requiresHandoff: data.requiresHandoff,
          handoffReason: data.handoffReason,
          interactiveData: data.interactiveData || (data.requiresHandoff ? { type: 'HANDOFF', reason: data.handoffReason } : undefined),
          thinkingSteps: data.thinkingSteps || (reasonEnabled
            ? [
                { label: 'Validated query constraints against Enterprise ADR repository' },
                { label: 'Synthesized high-availability & fault-tolerance recommendations' },
                { label: 'Structured implementation roadmap with milestone timelines' },
              ]
            : undefined),
          reasoningTrace: data.reasoningTrace,
        },
      ]);

      // Perceived streaming
      const words = fullText.split(' ');
      let currentText = '';

      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        setMessages((prev) => {
          const newMsgs = [...prev];
          const lastIdx = newMsgs.length - 1;
          if (newMsgs[lastIdx]) {
            newMsgs[lastIdx].content = currentText;
          }
          return newMsgs;
        });

        // Speed adjustment
        if (i % 6 === 0) {
          await new Promise((r) => setTimeout(r, 12));
        }
      }

      setMessages((prev) => {
        const newMsgs = [...prev];
        const lastIdx = newMsgs.length - 1;
        if (newMsgs[lastIdx]) {
          newMsgs[lastIdx].content = fullText;
          newMsgs[lastIdx].isStreaming = false;
        }
        if (!isTemporaryChat) {
          ChatStorage.saveSessionMessages(activeSessionId, newMsgs);
        }
        return newMsgs;
      });

      // Refresh session titles from DB if not temporary
      if (!isTemporaryChat) {
        refreshSessions();
      }

    } catch (err) {
      console.error('Inference error', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '### Service Unavailable\nUnable to reach InGrowwth AI backend. Please verify server connection.',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const activeModelMeta =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  // Dynamic font class based on user settings
  const fontClass =
    chatFont === 'serif'
      ? 'font-serif'
      : chatFont === 'mono'
      ? 'font-mono'
      : 'font-sans';

  // Quick Action Pills (Claude Image 2 Style)
  const quickActions = [
    {
      icon: Database,
      label: 'Database Schema',
      query: 'Design an enterprise multi-tenant PostgreSQL database schema with complete DDL, UUIDv4 primary keys, row-level security policies, and Prisma ORM models.',
    },
    {
      icon: Terminal,
      label: 'Next.js 16 Microservices',
      query: 'Provide a production-ready Next.js 16 architecture blueprint with Server Actions, high-concurrency event bus, and sub-100ms API response caching.',
    },
    {
      icon: Rocket,
      label: 'Startup MVP Velocity',
      query: 'Outline an accelerated 4-week startup MVP technical roadmap for InGrowwth Innovations clients with prioritized core features and cloud infrastructure.',
    },
    {
      icon: Calendar,
      label: 'Schedule Meeting',
      query: 'I would like to schedule a technical discovery consultation with the InGrowwth Innovations engineering team.',
    },
    {
      icon: Shield,
      label: 'Zero-Trust Security',
      query: 'Conduct an architectural security review for zero-trust API access, secret rotation, and SOC2 compliance.',
    },
  ];

  // IF IN COWORK MODE, RENDER SPLIT SCREEN COWORK STUDIO
  if (interactionMode === 'cowork') {
    return (
      <CoworkWorkspace
        userEmail={userEmail}
        userName={userName}
        onExit={() => setInteractionMode('chat')}
      />
    );
  }

  return (
    <div className={`flex h-screen w-full bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 overflow-hidden ${fontClass} transition-colors duration-200`}>
      {/* Collapsible Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onMoveSession={handleMoveSession}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
        isTemporaryChat={isTemporaryChat}
        onToggleTemporaryChat={handleToggleTemporaryChat}
        userName={userName}
        projects={projects}
        folders={folders}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onCreateProject={handleCreateProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
        onToggleFolder={handleToggleFolder}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Header Bar */}
        <header className="h-14 w-full flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0a0d14]/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                title="Open Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              <span className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">
                {activeModelMeta.name}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                {activeModelMeta.speed}
              </span>
            </div>

            {/* Incognito / Temporary Chat Active Badge */}
            {isTemporaryChat && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 text-[11px] font-medium">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Temporary Chat (Not Saved)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Settings Trigger Icon Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Settings & Personalization"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {messages.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Export Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title="Clear view"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Temporary Chat Notice Banner */}
        {isTemporaryChat && (
          <div className="bg-purple-100 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-500/20 px-4 py-2 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <EyeOff className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>
                <strong>Incognito Mode Active:</strong> Queries in this session will not be saved to history, used in memory, or retained on servers.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleTemporaryChat}
              className="text-[11px] underline text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-white cursor-pointer"
            >
              Turn off
            </button>
          </div>
        )}

        {/* Chat Feed Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 pb-44">
          {messages.length === 0 ? (
            /* Empty State / Welcome Screen - Matches Claude Reference Image 2 */
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center pt-10">
              {/* Claude-style Warm Greeting Banner */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 mb-8"
              >
                {/* Stylized Sun Icon */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30 text-amber-500">
                  <Sun className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight text-slate-900 dark:text-white/95">
                  {greeting}
                </h1>
              </motion.div>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mb-10 leading-relaxed font-normal">
                What enterprise architecture, database schema, or product would you like to engineer today?
              </p>

              {/* Quick Action Pills (Claude Image 2 Style) */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSend(action.query)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span>{action.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Message List */
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-white dark:bg-white/5 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 shadow-sm'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`flex flex-col max-w-[88%] ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <div className="px-5 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm shadow-md whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full space-y-3">
                        {/* Thinking Process Accordion */}
                        {msg.thinkingSteps && (
                          <ThinkingProcess
                            steps={msg.thinkingSteps}
                            reasoningTrace={msg.reasoningTrace}
                            durationMs={msg.latencyMs}
                          />
                        )}

                        {/* Markdown Body with custom font formatting */}
                        <div className={`prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal ${fontClass}`}>
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match && !String(children).includes('\n');
                                if (isInline) {
                                  return (
                                    <code
                                      className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 font-mono text-indigo-700 dark:text-indigo-300 text-[11px]"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <CodeBlock
                                    language={match ? match[1] : 'text'}
                                    value={String(children).replace(/\n$/, '')}
                                  />
                                );
                              },
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>

                        {/* Interactive Data Widgets */}
                        {msg.requiresHandoff && <HandoffCard reason={msg.handoffReason} />}
                        {msg.interactiveData && <InteractiveMessage data={msg.interactiveData} />}

                        {/* Feedback & Copy Toolbar with RLHF learning */}
                        <FeedbackControls
                          messageId={msg.id}
                          query={msg.userQuery}
                          contentToCopy={msg.content}
                          latencyMs={msg.latencyMs}
                          userId={userId}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming Indicator */}
              {isProcessing && (
                <div className="flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500 dark:text-indigo-400" />
                    <span>InGrowwth AI Architect is reasoning &amp; querying patterns...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Fixed Bottom Input Area - Matches Claude Reference Image 2 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 dark:from-[#07090e] via-slate-50/95 dark:via-[#07090e]/95 to-transparent pt-10 z-20">
          <div className="max-w-3xl mx-auto w-full bg-white dark:bg-[#12151e] border border-slate-300 dark:border-white/10 focus-within:border-indigo-500/60 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/20">
            {/* Live Mic Listening Banner */}
            {isListening && (
              <div className="px-4 py-1.5 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-semibold">Listening... Speak technical question or requirements</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="text-[11px] underline font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}

            {/* Attached Files Preview Bar */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 py-1 px-2.5 rounded-lg text-xs text-indigo-700 dark:text-indigo-200"
                  >
                    <FileText className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                    <span className="truncate max-w-[140px] font-medium">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-500 ml-1 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Row */}
            <div className="p-3 px-4">
              {/* Voice Feedback Banner */}
              <AnimatePresence>
                {voiceFeedbackToast && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mb-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Activity className={`w-3.5 h-3.5 text-indigo-500 ${isVoiceSpeaking ? 'animate-bounce' : 'animate-pulse'}`} />
                      <span className="font-medium text-[11px] sm:text-xs">{voiceFeedbackToast}</span>
                    </div>
                    {isVoiceSpeaking && (
                      <button
                        type="button"
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setIsVoiceSpeaking(false);
                          setVoiceFeedbackToast(null);
                        }}
                        className="text-[10px] font-semibold text-indigo-500 hover:underline cursor-pointer"
                      >
                        Stop Audio
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isTemporaryChat ? 'Ask anything in Incognito (queries will not be saved)...' : 'How can I help you today?'}
                className="w-full max-h-[160px] min-h-[44px] bg-transparent resize-none outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 scrollbar-none"
                rows={1}
              />

              {/* Bottom Control Bar Inside Input (Image 2 style) */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  {/* Plus / Upload Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title="Attach specs or files"
                  >
                    {showUploadAnimation ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>

                  {/* Chat / Cowork Mode Toggle Pills (Claude Image 2) */}
                  <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleSelectInteractionMode('chat')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                        interactionMode === 'chat'
                          ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectInteractionMode('cowork')}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    >
                      <span>Cowork</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                        Pro
                      </span>
                    </button>
                  </div>

                  {/* Incognito Pill Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleTemporaryChat}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      isTemporaryChat
                        ? 'bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40'
                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title="Toggle Incognito Temporary Chat"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span className="hidden sm:inline">Incognito</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Model Name Pill */}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline-block font-mono">
                    {activeModelMeta.name}
                  </span>

                  {/* Working Mic Icon with Speech Recognition */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 animate-pulse'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    title={isListening ? 'Click to stop listening' : 'Start voice dictation'}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  {/* Working Wave / Voice Agent Button (Quota Restricted in Simple Chat) */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceAgent}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer relative ${
                      isVoiceSpeaking
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 animate-pulse'
                        : voiceTurnsRemaining === 0
                        ? 'text-amber-500/80 hover:text-amber-500 hover:bg-amber-500/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    title={
                      isVoiceSpeaking
                        ? 'Voice Agent speaking — click to pause'
                        : voiceTurnsRemaining === 0
                        ? 'Voice Agent quota reached (3/3 used). Click to upgrade to Cowork Studio.'
                        : `InGrowwth Voice Agent (${voiceTurnsRemaining} of 3 free turns remaining)`
                    }
                  >
                    <Activity className={`w-3.5 h-3.5 ${isVoiceSpeaking ? 'animate-bounce' : ''}`} />
                    {voiceTurnsRemaining > 0 && voiceTurnsRemaining < 3 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                        {voiceTurnsRemaining}
                      </span>
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isProcessing}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                      (inputValue.trim() || uploadedFiles.length > 0) && !isProcessing
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30 hover:scale-105 cursor-pointer'
                        : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                    aria-label="Send Message"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings & Personalization Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userId={userId}
        userName={userName}
        isTemporaryChat={isTemporaryChat}
        onToggleTemporaryChat={handleToggleTemporaryChat}
        onExportAllChats={handleExportChat}
        onDeleteAllChats={handleDeleteAllChats}
        currentFont={chatFont}
        onSelectChatFont={setChatFont}
        voiceTurnsRemaining={voiceTurnsRemaining}
        onResetVoiceQuota={handleResetVoiceQuota}
        onOpenCowork={() => handleSelectInteractionMode('cowork')}
      />

      {/* Microphone Permission & Troubleshooting Modal */}
      <MicrophonePermissionModal
        isOpen={showMicPermissionModal}
        onClose={() => setShowMicPermissionModal(false)}
        onPermissionGranted={() => toggleListening()}
      />

      {/* Simple Chat Voice Limit Modal */}
      <AnimatePresence>
        {showVoiceLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-white dark:bg-[#12151e] border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5"
            >
              <button
                type="button"
                onClick={() => setShowVoiceLimitModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg text-white">
                <Volume2 className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                  Simple Chat Quota: 3 / 3 Turns Used
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  Voice Agent Simple Chat Limit
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Simple Chat provides 3 free Voice Agent interactions per session.
                  Switch to <strong>InGrowwth Cowork Studio</strong> for <strong>Unlimited Enterprise Voice Agent</strong> turns, real-time bidirectional reasoning, and <strong>24/7 background AI Dots</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Unlocked with Cowork Studio:
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1 pl-1">
                  <li>Unlimited Voice Agent turns with zero cooldown</li>
                  <li>24/7 Autonomous Background Dots (Sentinel, Code Daemon, Security)</li>
                  <li>Enterprise Plugins (Teams, WhatsApp, n8n, Slack, Notion, Claude)</li>
                </ul>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleResetVoiceQuota();
                    setShowVoiceLimitModal(false);
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Reset Demo Turns
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVoiceLimitModal(false);
                    handleSelectInteractionMode('cowork');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white text-center shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Switch to Cowork</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cowork Paywall Modal for Non-Whitelisted Users */}
      <AnimatePresence>
        {showCoworkPaywall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-white dark:bg-[#12151e] border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 space-y-5"
            >
              <button
                type="button"
                onClick={() => setShowCoworkPaywall(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg text-white">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                  Enterprise Feature
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  InGrowwth Cowork Studio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Cowork is restricted to authorized founder &amp; engineering team members. It unlocks simultaneous multi-agent task execution and live code generation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Authorized VIP Users:
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Meet (meett2110@gmail.com), Darshan (nairobi10nairobi@gmail.com), and Saurav (sauravp3011@gmail.com).
                </p>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCoworkPaywall(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="mailto:contact@ingrowwthinnovations.com?subject=InGrowwth%20Cowork%20Access%20Request"
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white text-center shadow-md cursor-pointer"
                >
                  Request Access
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
