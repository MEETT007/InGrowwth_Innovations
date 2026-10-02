// InGrowwth Innovations - 4 Distinct Voice Personas (2 Women, 2 Men)
// Tailored for specific organizational roles:
// 1. Aria (Female)   -> BDE & Strategic Sales
// 2. Leo (Male)      -> Technology Guidance & Full-Stack Lead
// 3. Zara (Female)   -> AI Assistance & GenAI Model Specialist
// 4. Marcus (Male)   -> Chief Architect & Engineering Director / Manager

export interface VoicePersona {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  role: string;
  category: string;
  vibe: string;
  preferredVoicePatterns: string[];
  basePitch: number;
  baseRate: number;
  sampleText: string;
  avatarColor: string;
  badgeBg: string;
}

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'aria-sales',
    name: 'Aria',
    gender: 'Female',
    role: 'BDE & Strategic Sales',
    category: 'Sales & Growth',
    vibe: 'Charismatic, persuasive, engaging & client-partnership focused',
    preferredVoicePatterns: [
      'samantha',
      'victoria',
      'karen',
      'zira',
      'flo (english (united states))',
      'google us english female',
      'female',
    ],
    basePitch: 1.08,
    baseRate: 1.04,
    sampleText:
      "Hello Meet! I'm Aria from InGrowwth Strategic Partnerships. I help clients scale their technical ventures, structure enterprise contracts, and unlock market velocity.",
    avatarColor: 'from-amber-400 to-rose-500',
    badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  {
    id: 'leo-tech',
    name: 'Leo',
    gender: 'Male',
    role: 'Technology Guidance & Full-Stack Lead',
    category: 'Technical Advisory',
    vibe: 'Articulate, hands-on, practical & stack-mentoring focused',
    preferredVoicePatterns: [
      'aaron',
      'reed (english (united states))',
      'alex',
      'fred',
      'google us english male',
      'david',
      'male',
    ],
    basePitch: 0.96,
    baseRate: 1.0,
    sampleText:
      "Hey there! I'm Leo, your Technology Guidance mentor. I walk you through Next.js 16 server components, PostgreSQL indexing, and high-concurrency microservices.",
    avatarColor: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  {
    id: 'zara-ai',
    name: 'Zara',
    gender: 'Female',
    role: 'AI Assistance & GenAI Model Specialist',
    category: 'Neural Swarms',
    vibe: 'Ultra-precise, futuristic, crisp & machine-learning specialized',
    preferredVoicePatterns: [
      'shelley (english (united states))',
      'tessa',
      'moira',
      'kathy',
      'flo',
      'sandy',
      'female',
    ],
    basePitch: 1.22,
    baseRate: 1.02,
    sampleText:
      "Greetings Meet. I am Zara, your AI Assistance Specialist. I orchestrate LangGraph multi-agent swarms, pgvector embeddings, and accelerated hybrid inference.",
    avatarColor: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  {
    id: 'marcus-manager',
    name: 'Marcus',
    gender: 'Male',
    role: 'Chief Architect & Engineering Manager',
    category: 'Executive Architecture',
    vibe: 'Authoritative, executive, deep, strategic & high-level governance',
    preferredVoicePatterns: [
      'daniel (english (united kingdom))',
      'daniel',
      'arthur',
      'rocko (english (united states))',
      'oliver',
      'george',
      'male',
    ],
    basePitch: 0.82,
    baseRate: 0.94,
    sampleText:
      "Good day Meet. Marcus here, Engineering Director and Chief Architect. Let's review your PostgreSQL Row-Level Security policies and enterprise ADR compliance.",
    avatarColor: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
];

// Fallback legacy mapping for any previously saved IDs
export function normalizePersonaId(id?: string): string {
  if (!id) return 'aria-sales';
  const lower = id.toLowerCase();
  if (lower.includes('aria') || lower.includes('nova') || lower.includes('sales')) return 'aria-sales';
  if (lower.includes('leo') || lower.includes('alloy') || lower.includes('tech')) return 'leo-tech';
  if (lower.includes('zara') || lower.includes('shimmer') || lower.includes('ai')) return 'zara-ai';
  if (lower.includes('marcus') || lower.includes('onyx') || lower.includes('manager') || lower.includes('architect')) return 'marcus-manager';
  return 'aria-sales';
}

export function getVoicePersona(id?: string): VoicePersona {
  const normId = normalizePersonaId(id);
  return VOICE_PERSONAS.find((p) => p.id === normId) || VOICE_PERSONAS[0];
}

/**
 * Resolves the actual SpeechSynthesisVoice from available browser voices
 */
export function resolveBrowserVoice(
  persona: VoicePersona,
  availableVoices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!availableVoices || availableVoices.length === 0) return null;

  // Filter English voices first
  const englishVoices = availableVoices.filter(
    (v) => v.lang.startsWith('en') || v.lang.startsWith('EN')
  );
  const voicePool = englishVoices.length > 0 ? englishVoices : availableVoices;

  // 1. Try exact or partial pattern matches
  for (const pattern of persona.preferredVoicePatterns) {
    const match = voicePool.find((v) => v.name.toLowerCase().includes(pattern));
    if (match) return match;
  }

  // 2. Gender heuristic fallback
  if (persona.gender === 'Female') {
    const femaleMatch = voicePool.find(
      (v) =>
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('woman') ||
        v.name.toLowerCase().includes('girl') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('zira')
    );
    if (femaleMatch) return femaleMatch;
  } else {
    const maleMatch = voicePool.find(
      (v) =>
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('man') ||
        v.name.toLowerCase().includes('david') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('aaron') ||
        v.name.toLowerCase().includes('alex') ||
        v.name.toLowerCase().includes('george')
    );
    if (maleMatch) return maleMatch;
  }

  // 3. Fallback to default or first English voice
  return voicePool.find((v) => v.default) || voicePool[0] || null;
}

/**
 * Unified speech synthesis runner with tailored pitch, rate, and voice binding
 */
export function speakWithPersona({
  text,
  personaId,
  userRate = 1.0,
  onStart,
  onEnd,
  onError,
}: {
  text: string;
  personaId?: string;
  userRate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  window.speechSynthesis.cancel();

  const persona = getVoicePersona(personaId);
  const utterance = new SpeechSynthesisUtterance(text);

  // Compute combined rate (persona base * user multiplier)
  utterance.rate = Math.max(0.6, Math.min(2.0, persona.baseRate * userRate));
  utterance.pitch = persona.basePitch;

  // Bind browser voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = resolveBrowserVoice(persona, voices);
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
  return utterance;
}
