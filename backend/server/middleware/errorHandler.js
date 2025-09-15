const { AppError } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    user: req.user?.id,
  });

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new AppError(message, 400, "CONFLICT");
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new AppError(message, 400, "VALIDATION_ERROR");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new AppError(message, 401, "UNAUTHORIZED");
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new AppError(message, 401, "UNAUTHORIZED");
  }

  const errorResponse = {
    success: false,
    error: {
      message: error.message || "Server Error",
      code: error.errorCode || "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  };

  console.log(
    "🔍 Backend sending error response:",
    JSON.stringify(errorResponse, null, 2)
  );
  console.log("🔍 Error status code:", error.statusCode || 500);

  res.status(error.statusCode || 500).json(errorResponse);
};

module.exports = errorHandler;
