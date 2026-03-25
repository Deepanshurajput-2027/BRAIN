import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

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

  // Log the error
  if (error.statusCode >= 500) {
    logger.error(`[API ERROR] ${req.method} ${req.url} - ${error.message}`, {
      statusCode: error.statusCode,
      stack: error.stack,
      body: req.body,
      params: req.params,
    });
  } else {
    logger.warn(`[CLIENT ERROR] ${req.method} ${req.url} - ${error.message}`, {
      statusCode: error.statusCode,
      body: req.body,
    });
  }

  return res.status(error.statusCode).json(response);
};
