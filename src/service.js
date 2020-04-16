const zlib = require('zlib');

/**
 * Decompresses either Gzip or Deflate stream
 * @param {Buffer} buffer
 */
const unzip = (buffer) => new Promise((resolve, reject) => {
    zlib.unzip(buffer, async (error, data) => {
        if (error) {
            reject(error);
        }
        resolve(data);
    });
});

/**
 * Compresses stream into Gzip
 * @param {String} buffer
 */
const gzip = (buffer) => new Promise((resolve, reject) => {
    zlib.gzip(buffer, async (error, data) => {
        if (error) {
            reject(error);
        }
        resolve(data);
    });
});

/**
 * Phrase to insert in the web page
 */
const phrase = 'Hello world!';

/**
 * Html-code containing a phrase to insert instead of </body> tag
 */
const replacement = `<h1 style="position: absolute; top: 10px; left: 20px;
                    color: aqua; z-index: 1000;">${phrase}</h1></body>`;

/**
 * Replaces html tag </body> with 'replacement' code
 * @param {String} html
 */
const markWithPhrase = (html) => html.replace(/<\/body>/, replacement);

module.exports = {
    unzip,
    gzip,
    markWithPhrase,
};
