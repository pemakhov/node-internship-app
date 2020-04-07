import http from 'http';
import express from 'express';
import EventManager from './EventManager';

/**
 * Class creating and configuring the server
 */
export default class ServerConfigurator {
    /**
     * The server to configure
     */
    private server: express.Application;

    /**
     * The port that server listens to
     */
    private port: string;

    /**
     * Class constructor
     * @param server
     */
    constructor(server: express.Application) {
        this.server = server;
        this.port = this.getPort();
    }

    /**
     * Gets port
     */
    private getPort(): string {
        return this.server.get('port');
    }

    /**
     * Configures the server
     */
    public createServer(): void {
        const eventManager: EventManager = new EventManager();
        eventManager.bind(http.createServer(this.server).listen(this.port), this.port);
    }
}
