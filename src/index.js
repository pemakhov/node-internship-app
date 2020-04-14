/* eslint-disable no-console */
const http = require('http');
const url = require('url');
const httpProxy = require('http-proxy');
const service = require('./service');

/**
 * Port number
 */
const PORT = 3000;

/**
 * Proxy server
 */
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
            res.write(result);
            res.end();
        });
    } catch (error) {
        console.error(error);
    }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
proxy.on('proxyRes', onProxyRes);
