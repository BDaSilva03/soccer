const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/randomPlayer', '/register', '/login'],
    createProxyMiddleware({
      target: 'http://backend:3001',
      changeOrigin: true,
    })
  );
};
