/**
 * Production-safe logging utility
 * Logs are only displayed in development and are stripped from production builds
 */

const isDevelopment =
  process.env.REACT_APP_NODE_ENV === "development" || !process.env.REACT_APP_NODE_ENV;
const isProduction = process.env.REACT_APP_NODE_ENV === "production";

class Logger {
  static log(...args) {
    // Completely silent - no logs in any environment
    // Uncomment the line below if you want development logs
    // if (isDevelopment) { console.log(...args); }
  }

  static error(...args) {
    // Completely silent - no logs in any environment
    // Uncomment the line below if you want development error logs
    // if (isDevelopment) { console.error(...args); }

    // In production, you might want to send errors to a logging service
    if (isProduction) {
      this.sendToExternalService("error", ...args);
    }
  }

  static warn(...args) {
    // Completely silent - no logs in any environment
    // if (isDevelopment) { console.warn(...args); }
  }

  static info(...args) {
    // Completely silent - no logs in any environment
    // if (isDevelopment) { console.info(...args); }
  }

  static debug(...args) {
    // Completely silent - no logs in any environment
    // if (isDevelopment) { console.debug(...args); }
  }

  // For critical errors that should always be logged (even in production)
  static critical(...args) {
    console.error(...args);
    this.sendToExternalService("critical", ...args);
  }

  // Send logs to external service (Sentry, LogRocket, etc.)
  static sendToExternalService(level, ...args) {
    if (isProduction) {
      try {
        // Example: Send to Sentry
        if (window.Sentry) {
          window.Sentry.captureMessage(args.join(" "), level);
        }

        // Example: Send to your own logging endpoint
        // fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     level,
        //     message: args.join(' '),
        //     timestamp: new Date().toISOString(),
        //     url: window.location.href,
        //     userAgent: navigator.userAgent
        //   })
        // }).catch(() => {}); // Silent fail
      } catch (error) {
        // Silent fail - don't log the logging error
      }
    }
  }
}

export default Logger;
