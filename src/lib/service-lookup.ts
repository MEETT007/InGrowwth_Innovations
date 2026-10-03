import { db } from '@/lib/db';

export function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function sanitizeSlug(raw: string): string {
  return decodeSlug(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const SERVICE_ALIASES: Record<string, string[]> = {
  'ai-machine-learning': [
    'ai-ml',
    'aiml',
    'ai',
    'ml',
    'machine-learning',
    'artificial-intelligence',
    'ai-&-machine-learning',
    'ai-%26-machine-learning',
    'ai-and-machine-learning',
    'ai/ml',
  ],
  'cloud-devops-solutions': [
    'cloud-devops',
    'cloud',
    'devops',
    'cloud-solutions',
    'cloud-&-devops-solutions',
    'cloud-%26-devops-solutions',
    'cloud-and-devops',
    'cloud/devops',
  ],
  'mobile-app-development': [
    'mobile-apps',
    'mobile-app',
    'mobile',
    'ios-android',
    'flutter',
    'react-native',
    'mobile-development',
  ],
  'web-development': [
    'web-dev',
    'web',
    'web-apps',
    'fullstack',
    'full-stack',
    'website-development',
  ],
  'erp-enterprise-software': [
    'erp',
    'erp-enterprise',
    'erp-solutions',
    'enterprise-software',
    'enterprise',
  ],
  'cybersecurity': ['security', 'cyber-security', 'infosec', 'cyber'],
  'onestream-epm': ['onestream', 'epm'],
};

export async function findServiceBySlugOrId(rawParam: string) {
  if (!rawParam || typeof rawParam !== 'string') return null;

  const decoded = decodeSlug(rawParam);
  const sanitized = sanitizeSlug(rawParam);

  // 1. Direct match on slug or id
  let service = await db.service.findFirst({
    where: {
      OR: [
        { slug: rawParam },
        { slug: decoded },
        { slug: sanitized },
        { id: rawParam },
        { id: decoded },
      ],
    },
  });

  if (service) return service;

  // 2. Check alias mapping
  for (const [canonicalSlug, aliases] of Object.entries(SERVICE_ALIASES)) {
    if (
      aliases.includes(sanitized) ||
      aliases.includes(decoded) ||
      aliases.includes(rawParam) ||
      aliases.includes(rawParam.toLowerCase())
    ) {
      service = await db.service.findFirst({
        where: {
          OR: [
            { slug: canonicalSlug },
            { title: { contains: canonicalSlug.split('-')[0], mode: 'insensitive' } },
          ],
        },
      });
      if (service) return service;
    }
  }

  // 3. Fallback: match by title slug or partial title slug
  const allServices = await db.service.findMany();
  for (const s of allServices) {
    const sTitleSlug = sanitizeSlug(s.title);
    if (sTitleSlug === sanitized || (s.slug && sanitizeSlug(s.slug) === sanitized)) {
      return s;
    }
    if (sanitized.length >= 3 && (sTitleSlug.includes(sanitized) || sanitized.includes(sTitleSlug))) {
      return s;
    }
  }

  return null;
}
