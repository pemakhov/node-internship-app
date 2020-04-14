/* eslint-disable no-console */
const http = require('http');
const url = require('url');
const httpProxy = require('http-proxy');
const service = require('./service');

const PORT = 3000;

const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
    try {
        const { host } = url.parse(req.url, true).query;

        proxy.web(req, res, {
            target: host,
            changeOrigin: true,
            followRedirects: true,
            selfHandleResponse: true,
        });
    } catch (error) {
        console.error(error);
    }
});

const onProxyRes = (proxyRes, req, res) => {
    try {
        const bodyChunks = [];
        proxyRes.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });

        proxyRes.on('end', async () => {
            const data = Buffer.concat(bodyChunks);
            const html = await service.unzip(data);
            const markedHtml = service.markWithPhrase(html.toString());
            const result = await service.gzip(markedHtml);

            res.setHeader('Content-Encoding', 'gzip');
            res.write(result);
            res.end();
        });
    } catch (error) {
        console.error(error);
    }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
proxy.on('proxyRes', onProxyRes);
