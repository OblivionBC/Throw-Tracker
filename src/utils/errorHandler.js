class ErrorHandler {
  static handle(error, context = "") {
    Logger.error(`Error in ${context}:`, error);

    // Extract error message
    let message = "An unexpected error occurred";
    let code = "UNKNOWN_ERROR";

    // Handle both new error format and legacy format
    if (error.response?.data?.error) {
      message = error.response.data.error.message;
      code = error.response.data.error.code;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
      code = error.code || "HTTP_ERROR";
    } else if (error.message) {
      message = error.message;
      code = error.code || "UNKNOWN_ERROR";
    }

    // Log to external service (Sentry, LogRocket, etc.)
    this.logToExternalService(error, context);

    return { message, code };
  }

  static logToExternalService(error, context) {
    // Integrate with Sentry, LogRocket, or similar
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: { context },
        extra: { error },
      });
    }
  }

  static showUserFriendlyMessage(error) {
    const { message, code } = this.handle(error);

    // Map error codes to user-friendly messages
    const userMessages = {
      VALIDATION_ERROR: "Please check your input and try again.",
      NOT_FOUND: "The requested resource was not found.",
      UNAUTHORIZED: "Please log in to continue.",
      CONFLICT: "This action conflicts with existing data.",
      NETWORK_ERROR: "Please check your internet connection.",
      TIMEOUT: "The request took too long. Please try again.",
    };

    return userMessages[code] || message;
  }
}

export default ErrorHandler;
