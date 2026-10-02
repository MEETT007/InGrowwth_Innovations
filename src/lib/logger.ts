import { env } from './env';

export const logger = {
  debug: (...args: any[]) => log('DEBUG', ...args),
  info: (...args: any[]) => log('INFO', ...args),
  warn: (...args: any[]) => log('WARN', ...args),
  error: (...args: any[]) => log('ERROR', ...args),
};

function log(level: string, ...args: any[]) {
  const isServer = typeof window === 'undefined';
  const isEnabled = isServer ? env.LOG_ENABLED : env.NEXT_PUBLIC_LOG_ENABLED;

  if (!isEnabled) return;

  const timestamp = new Date().toISOString();
  const envPrefix = env.APP_ENV ? `[${env.APP_ENV.toUpperCase()}]` : '[CLIENT]';

  // Filtering out secrets: a simple string replacer for the args
  const safeArgs = args.map(arg => {
    if (typeof arg === 'string') {
      return sanitize(arg);
    }
    if (arg && typeof arg === 'object') {
      try {
        return JSON.parse(sanitize(JSON.stringify(arg)));
      } catch {
        return arg;
      }
    }
    return arg;
  });

  const method = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;
  method(`${timestamp} ${envPrefix} [${level}]`, ...safeArgs);
}

function sanitize(str: string): string {
  return str.replace(/(sk_[a-zA-Z0-9_]{10,})/g, '[REDACTED_SECRET]')
            .replace(/(pk_[a-zA-Z0-9_]{10,})/g, '[REDACTED_PUBLISHABLE_KEY]')
            .replace(/(re_[a-zA-Z0-9_]{10,})/g, '[REDACTED_API_KEY]')
            .replace(/(password["']?\s*:\s*["'])([^"']+)(["'])/gi, '$1[REDACTED]$3')
            .replace(/(token["']?\s*:\s*["'])([^"']+)(["'])/gi, '$1[REDACTED]$3');
}
