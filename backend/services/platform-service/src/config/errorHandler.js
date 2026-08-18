import { env } from './env.js';

export function errorHandler(err, req, res, next) {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({
      success: false,
      message: 'Image is too large. Please upload a smaller file.',
    });
    return;
  }

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
