import { ApiError } from '../utils/apiError.js';

/**
 * 404 Route Not Found Middleware
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Endpoint not found: [${req.method}] ${req.originalUrl}`);
  next(error);
};

/**
 * Centralized Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';

    // Mongoose duplicate key error
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue)[0];
      message = `An account or record with this ${field} already exists.`;
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      const errors = Object.values(error.errors).map((val) => val.message);
      message = `Validation Failed: ${errors.join(', ')}`;
    }

    // Mongoose CastError (Invalid ObjectId)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ID format: '${error.value}' is not a valid identifier.`;
    }

    // JWT Errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token.';
    }

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    ...(error.errors && error.errors.length > 0 ? { errors: error.errors } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  };

  return res.status(error.statusCode || 500).json(response);
};
