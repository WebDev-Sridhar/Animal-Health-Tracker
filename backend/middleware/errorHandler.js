/**
 * Centralized error handler middleware
 * Handles all errors in a consistent format
 */

const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => {
      // Make error messages more specific
      if (e.message.includes("too long") || e.message.includes("longer than")) {
        return `${e.path}: Image data is too large. Maximum allowed size is 5MB.`;
      }
      if (e.message.includes("required")) {
        return `${e.path} is required`;
      }
      return e.message;
    });
    message = errors.join(", ");
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource";
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message =
      "Image file size exceeds 5MB limit. Please compress or resize your image and try again.";
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message =
      "Unexpected file field. Please provide an image in the photo field.";
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    statusCode,
  });

  const response = {
    success: false,
    error: message,
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
