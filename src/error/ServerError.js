/**
 * @exports
 * @extends Error
 */
class ServerError extends Error {
    /**
     * @constructor
     * @param {object} message
     */
    constructor(message) {
        super();
        this.message = message;
        this.name = 'E_UNEXPECTED_SERVER_RESPONSE';
    }
}

module.exports = ServerError;
