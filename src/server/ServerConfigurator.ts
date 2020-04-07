import http from 'http';
import express from 'express';
import EventManager from './EventManager';

export default class ServerConfigurator {
    private server: express.Application;

    private port: string;

    constructor(server: express.Application) {
        this.server = server;
        this.port = this.getPort();
    }

    private getPort(): string {
        return this.server.get('port');
    }

    public createServer(): void {
        const eventManager: EventManager = new EventManager();
        eventManager.bind(http.createServer(this.server).listen(this.port), this.port);
    }
}
