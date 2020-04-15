/* eslint-disable no-console */
const http = require('http');
const url = require('url');
const httpProxy = require('http-proxy');
const etag = require('etag');
const service = require('./service');

/**
 * Port number
 */
const PORT = 3000;

/**
 * Proxy server
 */
const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    try {
        const { host } = url.parse(req.url, true).query;
        console.log(host);
        console.log(req.url);

        proxy.web(req, res, {
            target: host,
            changeOrigin: true,
            followRedirects: true,
            selfHandleResponse: true,
        });
    } catch (error) {
        console.error(error);
        res.end(); // Interrupts loading if the URL is not proper
    }
});

/**
 * Changes and passes farther data
 * @param {Event} proxyRes
 * @param {Request} req
 * @param {Response} res
 */
const onProxyRes = (proxyRes, req, res) => {
    try {
        // Raw data accumulator
        const bodyChunks = [];
        proxyRes.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });

        proxyRes.on('end', async () => {
            // Concatinated raw data
            const data = Buffer.concat(bodyChunks);
            // Unzipped data
            const html = await service.unzip(data);
            // Html code with additional data
            const markedHtml = service.markWithPhrase(html.toString());
            // Compressed data
            const result = await service.gzip(markedHtml);

            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Length', Buffer.byteLength(result, 'utf-8'));
            res.setHeader('ETag', etag(result));
            res.setHeader('Cache-Control', 'max-age=3600');
            res.write(result);
            res.end();
        });
    } catch (error) {
        console.error(error);
    }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
proxy.on('proxyRes', onProxyRes);
