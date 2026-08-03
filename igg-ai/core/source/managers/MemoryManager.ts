export interface MemoryStore {
  getSessionData(sessionId: string): Promise<Record<string, any> | null>;
  saveSessionData(sessionId: string, data: Record<string, any>): Promise<void>;
  getPersistentData(userId: string): Promise<Record<string, any> | null>;
  savePersistentData(userId: string, data: Record<string, any>): Promise<void>;
}

export class MemoryManager {
  private store: MemoryStore;

  constructor(store: MemoryStore) {
    this.store = store;
  }

  async getSession(sessionId: string) {
    return this.store.getSessionData(sessionId);
  }

  async saveSession(sessionId: string, data: Record<string, any>) {
    await this.store.saveSessionData(sessionId, data);
  }
  
  async getUserMemory(userId: string) {
    return this.store.getPersistentData(userId);
  }
}

// In-memory implementation for phase 2
class InMemoryStore implements MemoryStore {
  private sessions = new Map<string, Record<string, any>>();
  private users = new Map<string, Record<string, any>>();

  async getSessionData(sessionId: string) { return this.sessions.get(sessionId) || null; }
  async saveSessionData(sessionId: string, data: Record<string, any>) { this.sessions.set(sessionId, data); }
  async getPersistentData(userId: string) { return this.users.get(userId) || null; }
  async savePersistentData(userId: string, data: Record<string, any>) { this.users.set(userId, data); }
}

export const memoryManager = new MemoryManager(new InMemoryStore());
