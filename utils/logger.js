/**
 * Simple logging utility
 * Provides consistent log format across the application
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] ?? LOG_LEVELS.info;

const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message: typeof message === 'object' ? JSON.stringify(message) : message,
    ...meta,
  };
  return JSON.stringify(logEntry);
};

const log = (level, message, meta) => {
  if (LOG_LEVELS[level] <= currentLevel) {
    const output = formatLog(level, message, meta);
    const consoleMethod = level === 'error' ? console.error : console.log;
    consoleMethod(output);
  }
};

const logger = {
  error: (message, meta) => log('error', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  info: (message, meta) => log('info', message, meta),
  debug: (message, meta) => log('debug', message, meta),
};

module.exports = logger;
