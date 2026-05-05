/**
 * Logger Utility - Zero dependencies
 * Simple timestamped console logging
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor(level = 'INFO') {
    this.level = LOG_LEVELS[level] ?? LOG_LEVELS.INFO;
  }

  _formatTimestamp() {
    return new Date().toISOString();
  }

  _log(level, ...args) {
    const timestamp = this._formatTimestamp();
    const prefix = `[${timestamp}] [${level}]`;
    console.log(prefix, ...args);
  }

  debug(...args) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      this._log('DEBUG', ...args);
    }
  }

  info(...args) {
    if (this.level <= LOG_LEVELS.INFO) {
      this._log('INFO', ...args);
    }
  }

  warn(...args) {
    if (this.level <= LOG_LEVELS.WARN) {
      this._log('WARN', ...args);
    }
  }

  error(...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      this._log('ERROR', ...args);
    }
  }
}

// Singleton instance
const logger = new Logger(process.env.LOG_LEVEL || 'INFO');

export default logger;
export { Logger, LOG_LEVELS };
