'use client';

import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
  Zap,
  Check,
  ShieldCheck,
  PanelLeftClose,
  Settings as SettingsIcon,
  EyeOff,
  Folder,
  FolderOpen,
  FolderPlus,
  Briefcase,
  Edit2,
  X,
  MoreVertical,
  MoveRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectItem, FolderItem, StoredSessionItem } from '@/lib/chat-storage';

export type ChatSessionItem = StoredSessionItem;

export interface ModelOption {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  icon: typeof Sparkles;
  speed: string;
  reasoning: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'igg-architect-pro',
    name: 'IGG Architect Pro',
    tagline: 'Enterprise System Design, PostgreSQL Schemas & Full-Stack Cloud Architecture',
    badge: 'Flagship',
    icon: Sparkles,
    speed: 'High Throughput (~2.4s)',
    reasoning: 'Autonomous Synthesis',
  },
  {
    id: 'igg-deep-reasoning',
    name: 'IGG Deep Reasoning',
    tagline: 'Multi-Step Algorithmic Logic, Local Qwen 14B & Deep Code Verification',
    badge: 'Deep Think',
    icon: Layers,
    speed: 'Local CoT',
    reasoning: 'Chain-of-Thought',
  },
  {
    id: 'igg-flash-turbo',
    name: 'IGG Flash Turbo',
    tagline: 'Instant Technical Consulting, Rapid Ideation & Conversational Triage',
    badge: 'Sub-300ms',
    icon: Zap,
    speed: 'Instant (<0.3s)',
    reasoning: 'Adaptive Response',
  },
];

interface ChatSidebarProps {
  sessions: StoredSessionItem[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: (projectId?: string, folderId?: string | null) => void;
  onDeleteSession?: (id: string) => void;
  onRenameSession?: (id: string, newTitle: string) => void;
  onMoveSession?: (id: string, targetProjectId: string, targetFolderId: string | null) => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSettings?: () => void;
  isTemporaryChat?: boolean;
  onToggleTemporaryChat?: () => void;
  userName?: string;
  // Projects & Folders
  projects: ProjectItem[];
  folders: FolderItem[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string, color?: string) => void;
  onRenameProject?: (id: string, newName: string) => void;
  onDeleteProject?: (id: string) => void;
  onCreateFolder: (name: string, projectId: string) => void;
  onRenameFolder?: (id: string, newName: string) => void;
  onDeleteFolder?: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onMoveSession,
  selectedModel,
  onSelectModel,
  isOpen,
  onToggle,
  onOpenSettings,
  isTemporaryChat = false,
  onToggleTemporaryChat,
  userName = 'Meet',
  projects = [],
  folders = [],
  activeProjectId = 'proj-default',
  onSelectProject,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onToggleFolder,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  // New Project State
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // New Folder State
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Inline Rename State for Sessions
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingSessionTitle, setEditingSessionTitle] = useState('');

  // Move Session Popover State
  const [movingSessionId, setMovingSessionId] = useState<string | null>(null);

  const safeProjects = projects && projects.length > 0 ? projects : [
    {
      id: 'proj-default',
      name: 'General Architecture',
      color: '#6366f1',
      createdAt: Date.now(),
    }
  ];

  // Active Project Data
  const currentProject =
    safeProjects.find((p) => p.id === activeProjectId) || safeProjects[0];

  // Filter folders for current project
  const safeFolders = folders || [];
  const projectFolders = safeFolders.filter((f) => f.projectId === activeProjectId);

  // Filter sessions for current project and search query
  const safeSessions = sessions || [];
  const projectSessions = safeSessions.filter((s) => {
    const matchesProject = !s.projectId || s.projectId === activeProjectId;
    const matchesQuery = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesQuery;
  });

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  // Helper for starting session rename
  const handleStartRename = (e: React.MouseEvent, session: StoredSessionItem) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingSessionTitle(session.title);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editingSessionTitle.trim() && onRenameSession) {
      onRenameSession(sessionId, editingSessionTitle.trim());
    }
    setEditingSessionId(null);
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreatingProject(false);
      setProjectDropdownOpen(false);
    }
  };

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), activeProjectId);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 flex flex-col w-80 bg-slate-50 dark:bg-[#090b10] border-r border-slate-200 dark:border-white/10 transition-all duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:overflow-hidden lg:border-none'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight block">
                InGrowwth AI
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                Enterprise Studio
              </span>
            </div>
          </div>

          <button
            onClick={onToggle}
            type="button"
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Temporary / Incognito Chat Banner Notice */}
        {isTemporaryChat && (
          <div className="px-3 pt-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-semibold text-purple-900 dark:text-purple-200">
                    Temporary Chat Active
                  </div>
                  <div className="text-[9px] text-purple-700 dark:text-purple-300/80">
                    Chats won&apos;t be saved to history
                  </div>
                </div>
              </div>
              {onToggleTemporaryChat && (
                <button
                  type="button"
                  onClick={onToggleTemporaryChat}
                  className="text-[10px] text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Nav Actions */}
        <div className="p-3 pb-2 space-y-1.5">
          {/* New Consultation Button */}
          <button
            onClick={() => onNewChat(activeProjectId)}
            type="button"
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl font-medium text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>New consultation</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono">⌘K</span>
          </button>

          {/* Quick Incognito Toggle Button */}
          {onToggleTemporaryChat && (
            <button
              onClick={onToggleTemporaryChat}
              type="button"
              className={`w-full flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isTemporaryChat
                  ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <EyeOff className="w-3.5 h-3.5" />
                <span>Temporary (Incognito) Chat</span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  isTemporaryChat ? 'bg-purple-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'
                }`}
              />
            </button>
          )}
        </div>

        {/* Project Switcher Selector */}
        <div className="px-3 pb-2">
          <div className="relative">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1 flex items-center justify-between">
              <span>Active Project</span>
              <button
                type="button"
                onClick={() => setIsCreatingProject(!isCreatingProject)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium lowercase first-letter:uppercase"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>project</span>
              </button>
            </div>

            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 transition-all text-left cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: `${currentProject.color}25`, color: currentProject.color }}
                >
                  <Briefcase className="w-3 h-3" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                    {currentProject.name}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform shrink-0 ${
                  projectDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Project Inline Creation Bar */}
            {isCreatingProject && (
              <form onSubmit={handleCreateProjectSubmit} className="mt-1.5 flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New project name..."
                  className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-white/10 border border-indigo-500 text-slate-900 dark:text-white outline-none"
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                  title="Create"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="p-1 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Project Dropdown Menu */}
            <AnimatePresence>
              {projectDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 z-50 mt-1.5 p-1.5 rounded-xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/15 shadow-xl space-y-1 max-h-60 overflow-y-auto"
                >
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Workspace Project
                  </div>
                  {projects.map((proj) => {
                    const isSelected = proj.id === activeProjectId;
                    const sessionCount = sessions.filter((s) => s.projectId === proj.id).length;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => {
                          onSelectProject(proj.id);
                          setProjectDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-900 dark:text-white font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${proj.color}30`, color: proj.color }}
                          >
                            <Briefcase className="w-2.5 h-2.5" />
                          </div>
                          <span className="text-xs truncate">{proj.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                            {sessionCount}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                        </div>
                      </button>
                    );
                  })}

                  <div className="pt-1 border-t border-slate-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setProjectDropdownOpen(false);
                        setIsCreatingProject(true);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-600/10 font-medium cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Project</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model Switcher Selector */}
        <div className="px-3 pb-2">
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 transition-all text-left cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <currentModel.icon className="w-3 h-3" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {currentModel.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                      {currentModel.badge}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform ${
                  modelDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Model Dropdown Menu */}
            <AnimatePresence>
              {modelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 z-50 mt-1.5 p-1.5 rounded-xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/15 shadow-xl space-y-1"
                >
                  {AVAILABLE_MODELS.map((model) => {
                    const isSelected = model.id === selectedModel;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          onSelectModel(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <model.icon className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{model.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {model.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Session Filter */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-indigo-500 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Scrollable Content: Folders & Consultations */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
          {/* Folders Section */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Folder className="w-3 h-3 text-indigo-500" />
                <span>Folders</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-medium lowercase first-letter:uppercase"
                title="Create Folder"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>folder</span>
              </button>
            </div>

            {/* Folder Inline Creation */}
            {isCreatingFolder && (
              <form onSubmit={handleCreateFolderSubmit} className="mt-1 mb-2 px-1 flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name..."
                  className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-white/10 border border-indigo-500 text-slate-900 dark:text-white outline-none"
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                  title="Create"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="p-1 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Folders List */}
            <div className="space-y-1 mt-1">
              {projectFolders.length === 0 && !isCreatingFolder && (
                <div className="px-3 py-1.5 text-[11px] text-slate-400 italic">
                  No folders yet. Click + folder to organize.
                </div>
              )}

              {projectFolders.map((folder) => {
                const isExpanded = folder.isExpanded !== false;
                const folderSessions = projectSessions.filter((s) => s.folderId === folder.id);

                return (
                  <div key={folder.id} className="rounded-xl overflow-hidden">
                    {/* Folder Header */}
                    <div
                      onClick={() => onToggleFolder(folder.id)}
                      className="group flex items-center justify-between p-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        {isExpanded ? (
                          <FolderOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        )}
                        <span className="font-semibold truncate">{folder.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500">
                          {folderSessions.length}
                        </span>
                        {onDeleteFolder && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete folder "${folder.name}"? (Chats inside will not be deleted)`)) {
                                onDeleteFolder(folder.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity"
                            title="Delete folder"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Folder Sessions (when expanded) */}
                    {isExpanded && (
                      <div className="pl-5 pr-1 py-0.5 space-y-1 border-l-2 border-indigo-500/20 ml-3.5">
                        {folderSessions.length === 0 ? (
                          <div className="py-1 text-[10px] text-slate-400 italic">Empty folder</div>
                        ) : (
                          folderSessions.map((session) => renderSessionItem(session))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Root / General Consultations */}
          <div>
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>All Consultations</span>
              <span className="text-[10px] font-normal text-slate-400 font-mono">
                {projectSessions.length} total
              </span>
            </div>

            <div className="space-y-1 mt-1">
              {projectSessions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  {searchQuery ? 'No matching consultations' : 'No saved consultations yet'}
                </div>
              ) : (
                projectSessions
                  // Only display sessions here that are NOT in a project folder (to avoid duplicates)
                  .filter((s) => !s.folderId)
                  .map((session) => renderSessionItem(session))
              )}
            </div>
          </div>
        </div>

        {/* Bottom User Profile & Settings Area */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.02] space-y-2">
          {/* Settings Button */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <SettingsIcon className="w-4 h-4 text-slate-500" />
              <span>Settings &amp; Personalization</span>
            </button>
          )}

          {/* User Profile Mini Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm">
                {userName[0]?.toUpperCase() || 'M'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                  {userName}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  Enterprise Pro
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  // Renders a single session row with Rename, Folder Move, and Delete capabilities
  function renderSessionItem(session: StoredSessionItem) {
    const isActive = session.id === activeSessionId;
    const isEditing = editingSessionId === session.id;
    const isMoving = movingSessionId === session.id;

    if (isEditing) {
      return (
        <div
          key={session.id}
          className="p-1.5 rounded-xl bg-white dark:bg-white/10 border border-indigo-500 shadow-sm flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            autoFocus
            value={editingSessionTitle}
            onChange={(e) => setEditingSessionTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveRename(session.id);
              if (e.key === 'Escape') handleCancelRename();
            }}
            className="flex-1 px-1.5 py-0.5 text-xs bg-transparent text-slate-900 dark:text-white outline-none"
          />
          <button
            type="button"
            onClick={() => handleSaveRename(session.id)}
            className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 cursor-pointer"
            title="Save title (Enter)"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCancelRename}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
            title="Cancel (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    return (
      <div
        key={session.id}
        onClick={() => onSelectSession(session.id)}
        className={`group relative flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-900 dark:text-white border border-indigo-300 dark:border-indigo-500/30 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageSquare
            className={`w-3.5 h-3.5 shrink-0 ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-400'
            }`}
          />
          <span className="truncate font-medium">{session.title}</span>
        </div>

        {/* Action Controls on Hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
          {/* Rename Button */}
          {onRenameSession && (
            <button
              type="button"
              onClick={(e) => handleStartRename(e, session)}
              className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
              title="Rename consultation"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}

          {/* Move to Folder Button */}
          {onMoveSession && projectFolders.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMovingSessionId(isMoving ? null : session.id);
                }}
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
                title="Move to Folder"
              >
                <FolderPlus className="w-3 h-3" />
              </button>

              {/* Move to Folder Popover */}
              {isMoving && (
                <div
                  className="absolute right-0 top-full z-50 mt-1 w-44 p-1 rounded-xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/15 shadow-xl space-y-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-0.5 text-[9px] uppercase font-bold text-slate-400">
                    Move Consultation to:
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onMoveSession(session.id, activeProjectId, null);
                      setMovingSessionId(null);
                    }}
                    className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                      !session.folderId
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>General (No folder)</span>
                    {!session.folderId && <Check className="w-3 h-3" />}
                  </button>
                  {projectFolders.map((f) => {
                    const isCurrentFolder = session.folderId === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          onMoveSession(session.id, activeProjectId, f.id);
                          setMovingSessionId(null);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors flex items-center justify-between cursor-pointer ${
                          isCurrentFolder
                            ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{f.name}</span>
                        {isCurrentFolder && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Delete Button */}
          {onDeleteSession && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${session.title}"?`)) {
                  onDeleteSession(session.id);
                }
              }}
              className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
              title="Delete consultation"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }
}
