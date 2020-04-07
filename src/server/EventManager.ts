/* eslint-disable no-console */
import http from 'http';

/**
 * Class managing events
 */
export default class EventManager {
    /**
     * Manages the error behavior
     * @param  {NodeJS.ErrnoException} error
     * @param  {number|string|boolean} port
     * @returns throw error
     */
    private onError: Function = (error: NodeJS.ErrnoException, port: number | string | boolean) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
        /**
         * A string describing the port or the pipe
         */
        const bindPort: string = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

        switch (error.code) {
        case 'EACCES':
            console.error(`${bindPort} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bindPort} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
        }
    }

    /**
     * Manages events (that differ from errors) behavior
     * @inner
     * @description log port to console
     */
    // ? Arrow function doesn't work, as well as the ordinary syntax (!)
    // eslint-disable-next-line func-names
    private onListening: Function = function (): void {
        // ? Gave up finding the proper type (!)
        // eslint-disable-next-line @typescript-eslint/typedef
        const addr = this.address();
        const bindPort: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bindPort}`);
    }

    /**
     * Configures the server
     * @inner
     * @param {http.Server} Server
     * @param {string} port
     */
    public bind(Server: http.Server, port: string): void {
        Server.on('error', (error: Error) => this.onError(error, port));
        Server.on('listening', this.onListening.bind(Server));
    }
}
