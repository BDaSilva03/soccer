const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/randomPlayer',
    createProxyMiddleware({
      target: 'http://backend:3001',
      changeOrigin: true,
    })
  );
};
