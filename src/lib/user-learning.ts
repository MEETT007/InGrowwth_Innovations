/**
 * Adaptive User Learning & Personalization Store
 * Manages user custom instructions, tone preferences, and RLHF feedback memory
 * so the AI learns from thumbs-up and thumbs-down interactions.
 */

export interface UserPersonalization {
  userId: string;
  customInstructions?: string;
  preferredTone?: 'executive_architect' | 'technical_deepdive' | 'concise_direct';
  saveChatHistory: boolean;
  adaptiveLearningEnabled: boolean;
  defaultTemporaryChat: boolean;
  theme: 'system' | 'dark' | 'light';
  font: 'sans' | 'serif' | 'mono';
  reducedMotion: boolean;
  learnedPreferences: string[];
}

const memoryStore = new Map<string, UserPersonalization>();

export const DEFAULT_PERSONALIZATION: Omit<UserPersonalization, 'userId'> = {
  customInstructions: '',
  preferredTone: 'executive_architect',
  saveChatHistory: true,
  adaptiveLearningEnabled: true,
  defaultTemporaryChat: false,
  theme: 'dark',
  font: 'sans',
  reducedMotion: false,
  learnedPreferences: [
    'User prefers production-ready PostgreSQL DDL and Prisma ORM schemas over high-level summaries.',
    'User values sub-3s response latency and concrete Next.js 16 / TypeScript code examples.',
  ],
};

export class UserLearningStore {
  public static get(userId: string): UserPersonalization {
    const existing = memoryStore.get(userId);
    if (existing) return existing;

    const initialized: UserPersonalization = {
      userId,
      ...DEFAULT_PERSONALIZATION,
    };
    memoryStore.set(userId, initialized);
    return initialized;
  }

  public static update(userId: string, updates: Partial<UserPersonalization>): UserPersonalization {
    const current = this.get(userId);
    const updated = { ...current, ...updates, userId };
    memoryStore.set(userId, updated);
    return updated;
  }

  public static recordFeedback(
    userId: string,
    rating: 'POSITIVE' | 'NEGATIVE',
    query: string,
    reason?: string
  ): UserPersonalization {
    const profile = this.get(userId);
    if (!profile.adaptiveLearningEnabled) return profile;

    const querySummary = query.slice(0, 80).trim();
    let learning = '';

    if (rating === 'POSITIVE') {
      if (/schema|database|sql|table/i.test(query)) {
        learning = 'Positive reinforcement: User approved complete PostgreSQL DDL and Prisma models.';
      } else if (/code|action|function|api/i.test(query)) {
        learning = 'Positive reinforcement: User approved type-safe Next.js 16 implementation code.';
      } else {
        learning = `Positive reinforcement: User highly rated the structured architectural depth on "${querySummary}".`;
      }
    } else {
      if (reason) {
        learning = `Negative correction: User reported "${reason}" on "${querySummary}". Avoid generic high-level advice; deliver immediate runnable code/specifications.`;
      } else if (/schema|database/i.test(query)) {
        learning = 'Negative correction: User was dissatisfied with incomplete schemas. Always output full PostgreSQL tables with constraints and indexes.';
      } else {
        learning = `Negative correction: User requested deeper technical precision and faster execution on "${querySummary}".`;
      }
    }

    // Keep unique list capped at 10 most relevant learnings
    const existing = profile.learnedPreferences.filter((p) => p !== learning);
    const newLearnings = [learning, ...existing].slice(0, 10);

    profile.learnedPreferences = newLearnings;
    memoryStore.set(userId, profile);
    return profile;
  }

  public static clearLearnings(userId: string): UserPersonalization {
    const profile = this.get(userId);
    profile.learnedPreferences = [];
    memoryStore.set(userId, profile);
    return profile;
  }

  public static getPromptContext(userId: string): string {
    const profile = this.get(userId);
    if (!profile.adaptiveLearningEnabled && !profile.customInstructions) {
      return '';
    }

    const sections: string[] = [];

    if (profile.customInstructions && profile.customInstructions.trim().length > 0) {
      sections.push(`[USER CUSTOM INSTRUCTIONS]:\n${profile.customInstructions.trim()}`);
    }

    if (profile.preferredTone) {
      const toneMap: Record<string, string> = {
        executive_architect: 'Tone: Executive Solutions Architect (Authoritative, Strategic, Benchmark-Driven)',
        technical_deepdive: 'Tone: Senior Systems Engineer (Deep code, DDL, algorithmic trade-offs)',
        concise_direct: 'Tone: Concise & Direct (Bullet points, minimal prose, immediate code)',
      };
      sections.push(toneMap[profile.preferredTone] || '');
    }

    if (profile.adaptiveLearningEnabled && profile.learnedPreferences.length > 0) {
      sections.push(
        `[ADAPTIVE USER PREFERENCES (RLHF LEARNED MEMORY)]:\nThe user has trained this model with the following feedback:\n` +
          profile.learnedPreferences.map((p) => `- ${p}`).join('\n') +
          `\nAlways align your response to satisfy these learned user standards.`
      );
    }

    return sections.filter(Boolean).join('\n\n');
  }
}
