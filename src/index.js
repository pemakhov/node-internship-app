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
 * Host, parsed from url
 */
const mainHost = {
    name: '',
    isFresh: false,
};

/**
 * Proxy server
 */
const proxy = httpProxy.createProxyServer({});

/**
 * Http server with proxy
 */
const server = http.createServer((req, res) => {
    try {
        const { host } = url.parse(req.url, true).query;

        if (host) {
            mainHost.name = host;
            mainHost.isFresh = true;
        } else {
            // This is needed for inserting the data only for the first request
            mainHost.isFresh = false;
        }
        const currentUrl = host || mainHost.name.concat(req.url);

        proxy.web(req, res, {
            target: currentUrl,
            changeOrigin: true,
            followRedirects: true,
            selfHandleResponse: true,
        });
    } catch (error) {
        console.error(error);
    }
});

/**
 * Changes data if needed and proxies it
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
            // Concatinate raw data
            let data = Buffer.concat(bodyChunks);

            if (mainHost.isFresh) {
                // Unzipped data
                const html = await service.unzip(data);
                // Html code with additional data
                const markedHtml = service.markWithPhrase(html.toString());
                // Compress data
                data = await service.gzip(markedHtml);

                res.setHeader('Content-Encoding', 'gzip');
                res.setHeader('Content-Length', Buffer.byteLength(data, 'utf-8'));
            }

            res.write(data);
            res.end();
        });
    } catch (error) {
        console.error(error);
    }
};

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
proxy.on('proxyRes', onProxyRes);
