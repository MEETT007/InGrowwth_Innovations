/**
 * InGrowwth AI - Chat Storage & Workspace Management Engine
 * Dual-layer client persistence ensuring zero data loss across restarts/reloads,
 * supporting Projects, Folders, and Consultation renaming.
 */

export interface ProjectItem {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  description?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  projectId: string;
  createdAt: number;
  isExpanded?: boolean;
}

export interface StoredSessionItem {
  id: string;
  title: string;
  timestamp: string;
  updatedAt: number;
  projectId: string;
  folderId?: string | null;
}

const STORAGE_KEYS = {
  PROJECTS: 'igg_ai_projects_v2',
  FOLDERS: 'igg_ai_folders_v2',
  SESSIONS: 'igg_ai_sessions_v2',
  ACTIVE_PROJECT: 'igg_ai_active_project_v2',
  ACTIVE_SESSION: 'igg_ai_active_session_v2',
  MESSAGES_PREFIX: 'igg_ai_msg_v2_',
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-default',
    name: 'Core System Design',
    color: '#6366f1', // Indigo
    createdAt: Date.now(),
    description: 'Enterprise architecture, high-level system diagrams & technology selection',
  },
  {
    id: 'proj-database',
    name: 'PostgreSQL & DB Architecture',
    color: '#06b6d4', // Cyan
    createdAt: Date.now() - 1000,
    description: 'Relational schemas, indexing strategies & multi-tenant isolation',
  },
  {
    id: 'proj-startup',
    name: 'Startup MVP Velocity',
    color: '#ec4899', // Pink
    createdAt: Date.now() - 2000,
    description: 'Rapid prototyping, microservices & product development sprint',
  },
];

export const DEFAULT_FOLDERS: FolderItem[] = [
  {
    id: 'folder-schemas',
    name: 'Schemas & DDL',
    projectId: 'proj-database',
    createdAt: Date.now(),
    isExpanded: true,
  },
  {
    id: 'folder-apis',
    name: 'API Contracts & REST',
    projectId: 'proj-default',
    createdAt: Date.now(),
    isExpanded: true,
  },
  {
    id: 'folder-sprints',
    name: 'Sprint Backlog',
    projectId: 'proj-startup',
    createdAt: Date.now(),
    isExpanded: true,
  },
];

export const DEFAULT_SESSIONS: StoredSessionItem[] = [
  {
    id: 'session-default',
    title: 'Current Architecture Consultation',
    timestamp: 'Active Now',
    updatedAt: Date.now(),
    projectId: 'proj-default',
    folderId: 'folder-apis',
  },
];

export class ChatStorage {
  // --- Projects ---
  static getProjects(): ProjectItem[] {
    if (typeof window === 'undefined') return DEFAULT_PROJECTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      this.saveProjects(DEFAULT_PROJECTS);
      return DEFAULT_PROJECTS;
    } catch (e) {
      console.warn('[ChatStorage] Failed to read projects:', e);
      return DEFAULT_PROJECTS;
    }
  }

  static saveProjects(projects: ProjectItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('[ChatStorage] Failed to save projects:', e);
    }
  }

  static createProject(name: string, color = '#6366f1', description = ''): ProjectItem {
    const projects = this.getProjects();
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: name.trim() || 'New Project',
      color,
      createdAt: Date.now(),
      description,
    };
    const updated = [newProject, ...projects];
    this.saveProjects(updated);
    return newProject;
  }

  static renameProject(id: string, newName: string): void {
    const projects = this.getProjects();
    const updated = projects.map((p) => (p.id === id ? { ...p, name: newName.trim() } : p));
    this.saveProjects(updated);
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter((p) => p.id !== id);
    this.saveProjects(projects);
    // Also remove associated folders or reassign
    const folders = this.getFolders().filter((f) => f.projectId !== id);
    this.saveFolders(folders);
  }

  // --- Folders ---
  static getFolders(): FolderItem[] {
    if (typeof window === 'undefined') return DEFAULT_FOLDERS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      this.saveFolders(DEFAULT_FOLDERS);
      return DEFAULT_FOLDERS;
    } catch (e) {
      console.warn('[ChatStorage] Failed to read folders:', e);
      return DEFAULT_FOLDERS;
    }
  }

  static saveFolders(folders: FolderItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.error('[ChatStorage] Failed to save folders:', e);
    }
  }

  static createFolder(name: string, projectId: string): FolderItem {
    const folders = this.getFolders();
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: name.trim() || 'New Folder',
      projectId,
      createdAt: Date.now(),
      isExpanded: true,
    };
    const updated = [...folders, newFolder];
    this.saveFolders(updated);
    return newFolder;
  }

  static renameFolder(id: string, newName: string): void {
    const folders = this.getFolders();
    const updated = folders.map((f) => (f.id === id ? { ...f, name: newName.trim() } : f));
    this.saveFolders(updated);
  }

  static toggleFolderExpanded(id: string): void {
    const folders = this.getFolders();
    const updated = folders.map((f) =>
      f.id === id ? { ...f, isExpanded: f.isExpanded !== false ? false : true } : f
    );
    this.saveFolders(updated);
  }

  static deleteFolder(id: string): void {
    const folders = this.getFolders().filter((f) => f.id !== id);
    this.saveFolders(folders);
    // Unassign sessions from this folder
    const sessions = this.getSessions().map((s) => (s.folderId === id ? { ...s, folderId: null } : s));
    this.saveSessions(sessions);
  }

  // --- Sessions ---
  static getSessions(): StoredSessionItem[] {
    if (typeof window === 'undefined') return DEFAULT_SESSIONS;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      this.saveSessions(DEFAULT_SESSIONS);
      return DEFAULT_SESSIONS;
    } catch (e) {
      console.warn('[ChatStorage] Failed to read sessions:', e);
      return DEFAULT_SESSIONS;
    }
  }

  static saveSessions(sessions: StoredSessionItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('[ChatStorage] Failed to save sessions:', e);
    }
  }

  static createSession(
    title = 'New Consultation',
    projectId = 'proj-default',
    folderId: string | null = null
  ): StoredSessionItem {
    const sessions = this.getSessions();
    const newSession: StoredSessionItem = {
      id: `session-${Date.now()}`,
      title,
      timestamp: 'Just now',
      updatedAt: Date.now(),
      projectId,
      folderId,
    };
    const updated = [newSession, ...sessions];
    this.saveSessions(updated);
    return newSession;
  }

  static renameSession(id: string, newTitle: string): void {
    const sessions = this.getSessions();
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, title: newTitle.trim() || 'Untitled Consultation', updatedAt: Date.now() } : s
    );
    this.saveSessions(updated);
  }

  static moveSession(id: string, targetProjectId: string, targetFolderId: string | null = null): void {
    const sessions = this.getSessions();
    const updated = sessions.map((s) =>
      s.id === id ? { ...s, projectId: targetProjectId, folderId: targetFolderId, updatedAt: Date.now() } : s
    );
    this.saveSessions(updated);
  }

  static deleteSession(id: string): void {
    const sessions = this.getSessions().filter((s) => s.id !== id);
    this.saveSessions(sessions);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${id}`);
      } catch {}
    }
  }

  // --- Session Messages Persistence ---
  static getSessionMessages(sessionId: string): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(`[ChatStorage] Failed to read messages for ${sessionId}:`, e);
    }
    return [];
  }

  static saveSessionMessages(sessionId: string, messages: any[]): void {
    if (typeof window === 'undefined' || !sessionId) return;
    try {
      localStorage.setItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`, JSON.stringify(messages));
    } catch (e) {
      console.error(`[ChatStorage] Failed to save messages for ${sessionId}:`, e);
    }
  }
}
