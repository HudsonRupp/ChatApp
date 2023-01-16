const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        '/api',
        proxy.createProxyMiddleware({
            target: 'http://127.0.0.1:5000',
           // changeOrigin: true
        })
    );
    app.use(
        proxy.createProxyMiddleware('/chat', {
            target: 'http://127.0.0.1:5000',
            ws: true,
            changeOrigin: true,
            //logLevel: 'debug'
        })
    )
}