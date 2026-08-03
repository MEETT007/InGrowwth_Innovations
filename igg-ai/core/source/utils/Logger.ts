/**
 * Structured JSON Logger for Production (v1.0)
 * Replaces console.log with a format suitable for Datadog / CloudWatch / ELK.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export class Logger {
  private static format(level: LogLevel, message: string, meta?: any) {
    const logObj = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: process.env.NODE_ENV || 'development',
      ...meta,
    };

    // In production, we always output strict JSON to stdout/stderr.
    // In development, we can pretty-print.
    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify(logObj);
    } else {
      const color =
        level === LogLevel.ERROR || level === LogLevel.CRITICAL
          ? '\x1b[31m'
          : level === LogLevel.WARN
            ? '\x1b[33m'
            : level === LogLevel.INFO
              ? '\x1b[36m'
              : '\x1b[37m';
      const reset = '\x1b[0m';
      const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
      return `${color}[${logObj.timestamp}] [${level}] ${message}${reset}${metaStr}`;
    }
  }

  static debug(message: string, meta?: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(Logger.format(LogLevel.DEBUG, message, meta));
    }
  }

  static info(message: string, meta?: any) {
    console.info(Logger.format(LogLevel.INFO, message, meta));
  }

  static warn(message: string, meta?: any) {
    console.warn(Logger.format(LogLevel.WARN, message, meta));
  }

  static error(message: string, meta?: any) {
    console.error(Logger.format(LogLevel.ERROR, message, meta));
  }

  static critical(message: string, meta?: any) {
    console.error(Logger.format(LogLevel.CRITICAL, message, meta));
    // Here we would potentially trigger PagerDuty or an immediate alert webhook
  }
}
