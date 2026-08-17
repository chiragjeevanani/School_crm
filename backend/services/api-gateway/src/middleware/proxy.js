import { createProxyMiddleware } from 'http-proxy-middleware';

function proxyError(serviceName) {
  return (err, req, res) => {
    if (res.headersSent) return;
    res.status(502).json({
      success: false,
      message: `${serviceName} is unavailable`,
    });
  };
}

export function createServiceProxy(target, { stripPrefix, serviceName }) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${stripPrefix}`]: '' },
    on: {
      error: proxyError(serviceName),
    },
  });
}
