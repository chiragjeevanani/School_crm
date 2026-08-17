import { env } from '../config/env.js';
import { createServiceProxy } from '../middleware/proxy.js';

export function healthCheck(req, res) {
  res.json({
    success: true,
    service: 'api-gateway',
    message: 'School CRM gateway is running',
  });
}

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export const authProxy = createServiceProxy(env.authServiceUrl, {
  stripPrefix: '/api/v1/platform/auth',
  serviceName: 'Auth service',
});

export const platformProxy = createServiceProxy(env.platformServiceUrl, {
  stripPrefix: '/api/v1/platform',
  serviceName: 'Platform service',
});
