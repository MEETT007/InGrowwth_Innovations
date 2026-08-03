'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
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
  GripHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveMessage from './InteractiveMessage';
import FeedbackControls from './FeedbackControls';
import MeetingBooking from './MeetingBooking';
import HandoffCard from './HandoffCard';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@clerk/nextjs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  interactiveData?: Record<string, unknown>;
  requiresHandoff?: boolean;
  handoffReason?: string;
  isStreaming?: boolean;
}

export default function ChatWorkspace() {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [reasonEnabled, setReasonEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history
  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          const historyMessages = data.map(
            (msg: {
              id: string;
              role: 'user' | 'assistant';
              content: string;
              interactiveData?: Record<string, unknown>;
            }) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              interactiveData: msg.interactiveData,
              requiresHandoff: msg.interactiveData?.type === 'HANDOFF',
              handoffReason: (msg.interactiveData?.reason as string) || undefined,
            })
          );
          if (historyMessages.length > 0) {
            setMessages(historyMessages);
          }
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }
    };
    fetchHistory();
  }, [userId]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMessage = inputValue;
    setInputValue('');
    setIsProcessing(true);

    let contentStr = userMessage;
    if (uploadedFiles.length > 0) {
      contentStr = `[Attached: ${uploadedFiles.map((f) => f.name).join(', ')}] ` + contentStr;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: contentStr || 'Analyze these files.',
      },
    ]);

    setUploadedFiles([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: userId || 'e2e-session',
          query: contentStr || 'Analyze attached file',
        }),
      });

      const data = await response.json();

      // Fake streaming for perceived performance
      const fullText = data.text || 'An error occurred.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '', // Start empty
          isStreaming: true,
          requiresHandoff: data.requiresHandoff,
          handoffReason: data.handoffReason,
          interactiveData: data.requiresHandoff
            ? { type: 'HANDOFF', reason: data.handoffReason }
            : undefined,
        },
      ]);

      // Simulate typing speed
      const words = fullText.split(' ');
      let currentText = '';

      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];

        // Update the last message with the new text
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content = currentText;
          return newMsgs;
        });

        // Small delay between words
        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      // Finish streaming
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1].isStreaming = false;
        return newMsgs;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Error communicating with the backend.',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setShowUploadAnimation(true);

      setTimeout(() => {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setShowUploadAnimation(false);
      }, 800);
    }
  };

  const handleCommandSelect = (command: string) => {
    setInputValue(command);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">AI Consultant</h1>
            <p className="text-xs text-muted-foreground">InGrowwth Innovations Engine</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col relative scroll-smooth pb-32">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 mt-10">
            <div className="mb-8 w-24 h-24 relative opacity-90">
              {/* Animated Gradient Logo */}
              <svg viewBox="0 0 200 200" className="w-full h-full animate-pulse-slow">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="80" fill="url(#grad1)" fillOpacity="0.15" />
                <circle cx="100" cy="100" r="50" fill="url(#grad1)" fillOpacity="0.3" />
                <circle cx="100" cy="100" r="25" fill="url(#grad1)" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 mb-3">
                How can I help you build today?
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                I am your AI Architect. Upload a requirement document, ask a technical question, or
                describe a project.
              </p>
            </motion.div>

            {/* Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl px-4">
              {[
                { icon: <BookOpen className="w-4 h-4" />, text: 'Architect a scalable SaaS' },
                { icon: <Code className="w-4 h-4" />, text: 'Help me migrate to the cloud' },
                { icon: <PenTool className="w-4 h-4" />, text: 'Design a database schema' },
                { icon: <BrainCircuit className="w-4 h-4" />, text: 'Review my tech stack' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => handleCommandSelect(s.text)}
                  className="bg-card border border-border/50 p-4 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all flex flex-col gap-3 group shadow-sm"
                >
                  <div className="text-muted-foreground group-hover:text-indigo-400 transition-colors">
                    {s.icon}
                  </div>
                  <p className="text-sm font-medium text-foreground/80">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 mt-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    msg.role === 'user'
                      ? 'bg-muted border border-border text-muted-foreground'
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-500'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm text-sm sm:text-base whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-4 w-full">
                      <div className="prose prose-sm sm:prose-base dark:prose-invert prose-indigo max-w-none prose-p:leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>

                      {msg.requiresHandoff && <HandoffCard reason={msg.handoffReason} />}
                      {msg.interactiveData && <InteractiveMessage data={msg.interactiveData} />}
                      {msg.interactiveData?.type === 'REQUIREMENT_ANALYSIS' && <MeetingBooking />}
                      <FeedbackControls messageId={msg.id} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-indigo-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/30 rounded-2xl rounded-tl-sm w-fit">
                  <span
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area (Fixed Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-4xl mx-auto w-full bg-card border border-border/60 rounded-3xl shadow-2xl shadow-black/5 overflow-hidden transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
          {/* Attached Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-muted/50 py-1.5 px-3 rounded-lg border border-border/50 group"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-medium text-muted-foreground truncate max-w-[150px]">
                    {file.name}
                  </span>
                  <button
                    onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground/50 hover:text-destructive transition-colors ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text Area */}
          <div className="flex items-end gap-2 p-2 px-4">
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
              placeholder="Message AI Consultant..."
              className="flex-1 max-h-[200px] min-h-[44px] bg-transparent resize-none outline-none py-3 text-sm sm:text-base placeholder:text-muted-foreground scrollbar-hide"
              rows={1}
            />

            <div className="flex items-center gap-2 pb-2 shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors relative"
              >
                {showUploadAnimation ? (
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5">
                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-75" />
                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-150" />
                  </div>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isProcessing}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  (inputValue.trim() || uploadedFiles.length > 0) && !isProcessing
                    ? 'bg-indigo-500 text-white shadow-md hover:bg-indigo-600 hover:scale-105'
                    : 'bg-muted text-muted-foreground/50 cursor-not-allowed'
                }`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 bg-muted/10">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchEnabled(!searchEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  searchEnabled
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Web Search
              </button>
              <button
                onClick={() => setReasonEnabled(!reasonEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  reasonEnabled
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                Reasoning
              </button>
            </div>
            <div className="text-[10px] text-muted-foreground/60 hidden sm:block">
              Shift + Return for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
