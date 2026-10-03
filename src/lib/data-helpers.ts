/**
 * Data parsing and normalization helpers for admin forms and public rendering.
 * Safely handles arrays, JSON strings, comma-separated strings, and newline lists.
 */

export interface ProcessStep {
  step: string;
  details: string;
  [key: string]: string;
}

/**
 * Parses any incoming value (string array, JSON string, comma-separated string,
 * newline-separated string, bullet points) into a clean, trimmed array of strings.
 */
export function parseArrayField(val: unknown): string[] {
  if (val === null || val === undefined) return [];

  // If already an array
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') {
          // If array of objects like [{ name: 'React' }]
          const rec = item as Record<string, unknown>;
          return String(rec.name || rec.title || rec.value || rec.step || '').trim();
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }

  // If a string
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];

    // Attempt JSON parse if it looks like a JSON array
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parseArrayField(parsed);
        }
      } catch {
        // Fall back to delimiters
      }
    }

    // Check if newline separated
    if (trimmed.includes('\n')) {
      return trimmed
        .split('\n')
        .map((line) => line.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter(Boolean);
    }

    // Check if comma separated
    if (trimmed.includes(',')) {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // Single item string
    return [trimmed];
  }

  return [];
}

/**
 * Normalizes process steps into { step: string, details: string }[] format.
 * Handles arrays of objects, arrays of strings, JSON strings, or line-delimited items.
 */
export function parseProcessField(val: unknown): ProcessStep[] {
  if (val === null || val === undefined) return [];

  let rawItems: unknown[] = [];

  if (Array.isArray(val)) {
    rawItems = val;
  } else if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          rawItems = parsed;
        }
      } catch {
        // Fall back
      }
    }

    if (rawItems.length === 0) {
      if (trimmed.includes('\n')) {
        rawItems = trimmed
          .split('\n')
          .map((line) => line.replace(/^[-*•\d.]+\s*/, '').trim())
          .filter(Boolean);
      } else if (trimmed.includes(';')) {
        rawItems = trimmed.split(';').map((s) => s.trim()).filter(Boolean);
      } else {
        rawItems = [trimmed];
      }
    }
  }

  const defaultDetailsMap: Record<number, string> = {
    0: 'Comprehensive discovery, requirements scoping, and technical architecture definition.',
    1: 'Interactive UX/UI prototyping, user journey mapping, and visual design validation.',
    2: 'Sprint-based agile engineering with automated continuous integration and testing.',
    3: 'Security penetration testing, code auditing, and performance optimization.',
    4: 'Zero-downtime deployment, infrastructure monitoring, and post-launch evolution.',
  };

  return rawItems
    .map((item, idx): ProcessStep | null => {
      if (!item) return null;

      if (typeof item === 'object' && !Array.isArray(item)) {
        const obj = item as Record<string, unknown>;
        const step = String(
          obj.step || obj.title || obj.name || `Phase ${idx + 1}`
        ).trim();
        const details = String(
          obj.details || obj.description || obj.desc || defaultDetailsMap[idx] || ''
        ).trim();
        return { step, details };
      }

      if (typeof item === 'string') {
        const str = item.trim();
        if (!str) return null;

        // Check for "Title: Description" or "Title - Description"
        const colonIdx = str.indexOf(':');
        const dashIdx = str.indexOf(' - ');
        if (colonIdx > 0 && (dashIdx === -1 || colonIdx < dashIdx)) {
          return {
            step: str.substring(0, colonIdx).trim(),
            details: str.substring(colonIdx + 1).trim() || (defaultDetailsMap[idx] || ''),
          };
        } else if (dashIdx > 0) {
          return {
            step: str.substring(0, dashIdx).trim(),
            details: str.substring(dashIdx + 3).trim() || (defaultDetailsMap[idx] || ''),
          };
        }

        return {
          step: str,
          details: defaultDetailsMap[idx] || 'Systematic execution with continuous quality assurance and team collaboration.',
        };
      }

      return {
        step: `Phase ${idx + 1}`,
        details: String(item),
      };
    })
    .filter((step): step is ProcessStep => step !== null && step.step.length > 0);
}

/**
 * Standard 5-step process template for quick population in admin panel.
 */
export const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    step: 'Discovery & Architecture',
    details: 'In-depth stakeholder workshops, technical requirements analysis, and system architecture roadmap.',
  },
  {
    step: 'Design & Prototyping',
    details: 'Wireframing, interactive Figma design systems, and user experience validation.',
  },
  {
    step: 'Agile Engineering',
    details: 'Sprint-based development, clean modular code, and automated CI/CD pipeline integration.',
  },
  {
    step: 'Testing & Hardening',
    details: 'Automated test coverage, OWASP security audits, and Core Web Vitals optimization.',
  },
  {
    step: 'Deployment & Support',
    details: 'Zero-downtime production launch, live telemetry monitoring, and ongoing 24/7 SLA maintenance.',
  },
];

/**
 * Curated list of popular technologies for quick-tag selection in admin editors.
 */
export const POPULAR_TECH_TAGS = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'Tailwind CSS',
  'Flutter',
  'React Native',
  'AWS',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'MongoDB',
  'Prisma',
  'Redis',
  'FastAPI',
  'OpenAI API',
  'PyTorch',
  'GraphQL',
  'OneStream',
  'Framer Motion',
  'Firebase',
];

/**
 * Curated suggestions for service features.
 */
export const POPULAR_FEATURE_SUGGESTIONS = [
  'Next.js 15+ App Router & Server Components',
  'Responsive, Accessible & Pixel-Perfect UI/UX',
  'High-Performance Core Web Vitals & SEO Optimization',
  'Enterprise Role-Based Access Control (RBAC)',
  'Third-Party API & Payment Gateway Integrations',
  'Automated CI/CD Delivery with Zero Downtime',
  'Scalable Cloud Infrastructure (AWS / GCP / Azure)',
  'Container Orchestration with Docker & Kubernetes',
  '24/7 Real-Time System Monitoring & Health Alerts',
  'Enterprise Data Encryption & SOC 2 Compliance',
];

export interface MetricItem {
  value: string;
  label: string;
  [key: string]: string;
}

export function parseMetricsField(val: unknown): MetricItem[] {
  if (!val) return [];

  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          const rec = item as Record<string, unknown>;
          return {
            value: String(rec.value || rec.metric || rec.stat || '').trim(),
            label: String(rec.label || rec.name || rec.title || rec.desc || '').trim(),
          };
        }
        if (typeof item === 'string') {
          const parts = item.split(':');
          if (parts.length >= 2) {
            return { value: parts[0].trim(), label: parts[1].trim() };
          }
          return { value: item.trim(), label: 'Impact Metric' };
        }
        return null;
      })
      .filter((m): m is MetricItem => m !== null && Boolean(m.value || m.label));
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parseMetricsField(parsed);
      } catch {}
    }
    // Delimited string like "+240% Growth, 99.99% Uptime"
    return trimmed
      .split(/[,;\n]+/)
      .map((part) => {
        const p = part.trim();
        if (!p) return null;
        const colon = p.indexOf(':');
        if (colon > 0) {
          return { value: p.substring(0, colon).trim(), label: p.substring(colon + 1).trim() };
        }
        const space = p.indexOf(' ');
        if (space > 0 && /^[+\-0-9<>$%]+/.test(p)) {
          return { value: p.substring(0, space).trim(), label: p.substring(space + 1).trim() };
        }
        return { value: p, label: 'Impact' };
      })
      .filter((m): m is MetricItem => m !== null && Boolean(m.value));
  }

  return [];
}

export interface TestimonialData {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
}

export function parseTestimonialField(val: unknown): TestimonialData | null {
  if (!val) return null;

  if (typeof val === 'object' && !Array.isArray(val)) {
    const rec = val as Record<string, unknown>;
    const quote = String(rec.quote || rec.text || rec.comment || '').trim();
    if (!quote) return null;
    return {
      quote,
      author: rec.author ? String(rec.author).trim() : undefined,
      role: rec.role ? String(rec.role).trim() : undefined,
      company: rec.company ? String(rec.company).trim() : undefined,
    };
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseTestimonialField(parsed);
      } catch {}
    }
    // Plain string format like: "Working with InGrowwth was great! - John Doe, CTO"
    const dashIdx = trimmed.lastIndexOf(' - ');
    if (dashIdx > 0) {
      const quote = trimmed.substring(0, dashIdx).trim().replace(/^["']|["']$/g, '');
      const authorPart = trimmed.substring(dashIdx + 3).trim();
      const commaIdx = authorPart.indexOf(',');
      if (commaIdx > 0) {
        return {
          quote,
          author: authorPart.substring(0, commaIdx).trim(),
          role: authorPart.substring(commaIdx + 1).trim(),
        };
      }
      return { quote, author: authorPart };
    }
    return { quote: trimmed.replace(/^["']|["']$/g, '') };
  }

  return null;
}

export const POPULAR_SERVICES_SUGGESTIONS = [
  'Custom Web Application',
  'Mobile App Development',
  'Cloud Architecture & DevOps',
  'UI/UX Design & System',
  'API & Systems Integration',
  'AI / ML Model Deployment',
  'Cybersecurity Hardening',
  'ERP Customization',
  'Performance Optimization',
];

