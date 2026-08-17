import { env } from './env.js';

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
