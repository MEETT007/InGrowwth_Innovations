'use client';

import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import DragDropUpload from './DragDropUpload';
import InteractiveMessage from './InteractiveMessage';
import FeedbackControls from './FeedbackControls';
import MeetingBooking from './MeetingBooking';
import HandoffCard from './HandoffCard';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  interactiveData?: Record<string, unknown>;
  requiresHandoff?: boolean;
  handoffReason?: string;
}

export default function ChatWorkspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I am your AI Solutions Consultant. How can I help you architect your next product? Feel free to upload your requirements or wireframes below.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: input,
      },
    ]);

    setInput('');

    // Call real API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 'manual-test-session', query: input }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.text || 'An error occurred.',
          requiresHandoff: data.requiresHandoff,
          handoffReason: data.handoffReason,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Error communicating with the backend.',
        },
      ]);
    }
  };

  const handleFileUpload = (file: File) => {
    // Add file message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: `Uploaded: ${file.name}`,
      },
    ]);

    // Mock an interactive requirement intelligence response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I've analyzed your requirements document. Here is my technical assessment based on similar platforms we've built:",
          interactiveData: {
            type: 'REQUIREMENT_ANALYSIS',
            projectType: 'Mobility Platform',
            missingRequirements: ['Fraud Detection', 'Surge Pricing Engine'],
            techStack: ['Next.js', 'Flutter', 'PostgreSQL'],
            timeline: { min: 16, max: 24 },
            teamSize: 6,
          },
        },
      ]);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Sidebar - Optional for later (Chat history, settings) */}
      <div className="w-64 border-r border-gray-800 bg-gray-900/50 hidden md:flex flex-col p-4">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-semibold text-lg tracking-tight">AI Consultant</h2>
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Recent Projects
        </div>
        {/* Mock history */}
        <div className="space-y-2">
          <div className="p-2 rounded-md bg-gray-800/50 text-sm text-gray-300 cursor-pointer hover:bg-gray-800 transition-colors">
            Uber Clone Architecture
          </div>
          <div className="p-2 rounded-md text-sm text-gray-400 cursor-pointer hover:bg-gray-800 transition-colors">
            ERP Cloud Migration
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex space-x-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-gray-800 px-5 py-3 rounded-2xl rounded-tr-sm text-gray-100">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="prose prose-invert prose-blue max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    {msg.requiresHandoff && <HandoffCard reason={msg.handoffReason} />}

                    {/* Render Interactive UI Cards if data is attached */}
                    {msg.interactiveData && <InteractiveMessage data={msg.interactiveData} />}

                    {/* If the AI has reached a proposal stage, show the Meeting Booking widget */}
                    {msg.interactiveData?.type === 'REQUIREMENT_ANALYSIS' && <MeetingBooking />}

                    {/* Always show feedback on assistant messages */}
                    <FeedbackControls messageId={msg.id} />
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0 mt-1 order-2">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 pt-0">
          <DragDropUpload onFileUpload={handleFileUpload} />

          <div className="relative flex items-center bg-gray-900 border border-gray-700 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question or describe your project..."
              className="flex-1 bg-transparent px-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-xs text-gray-600">
              AI can make mistakes. Verify important business logic.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
