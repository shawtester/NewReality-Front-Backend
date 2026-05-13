/**
 * Simple Logger for production tracking.
 * Currently logs to console, but can be expanded to log to Firestore or Sentry.
 */
const logger = {
  error: (message, error, context = {}) => {
    console.error(`[ERROR] ${message}:`, error, context);
  },
  info: (message, context = {}) => {
    console.info(`[INFO] ${message}:`, context);
  },
  warn: (message, context = {}) => {
    console.warn(`[WARN] ${message}:`, context);
  },
};

export default logger;
