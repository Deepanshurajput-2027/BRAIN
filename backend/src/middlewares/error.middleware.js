import { ApiError } from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Normalize non-ApiError instances into ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    success: false,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${req.method} ${req.url}:`, error.message);
    if (error.stack) console.error(error.stack);
  }

  return res.status(error.statusCode).json(response);
};
