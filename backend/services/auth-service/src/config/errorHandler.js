import { env } from './env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (env.nodeEnv !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
