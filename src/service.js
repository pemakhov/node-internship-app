const zlib = require('zlib');

const unzip = (buffer) => new Promise((resolve, reject) => {
    zlib.unzip(buffer, async (error, data) => {
        if (error) {
            reject(error);
        }
        resolve(data);
    });
});

const gzip = (buffer) => new Promise((resolve, reject) => {
    zlib.gzip(buffer, async (error, data) => {
        if (error) {
            reject(error);
        }
        resolve(data);
    });
});

const replacement = `<h1 style="position: absolute; top: 10px; left: 20px;
                    color: aqua; z-index: 1000;">Hello world!</h1></body>`;

const markWithPhrase = (html) => html.replace(/<\/body>/, replacement);

module.exports = {
    unzip,
    gzip,
    markWithPhrase,
};
