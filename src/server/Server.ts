import express from 'express';
import Middleware from '../config/Middleware';
import Router from '../config/Router';

/**
 * Creates and sets up the server
 */
export default class Server {
    /**
     * The instance of the server
     * @type {express.Application}
     */
    private server: express.Application;

    /**
     * Class constructor
     * @param { express.Application } expressApp
     * @param middleware
     * @param routes
     */
    constructor(expressApp: express.Application, middleware: Middleware, routes: Router) {
        this.server = expressApp;
        this.middlewareInit(middleware, this.server);
        this.routesInit(routes, this.server);
        this.setPort(this.server);
    }

    /**
     * Joins the additional (middleware) functionality to the server
     * @description express.Application Middleware
     */
    private middlewareInit: Function = (middleware: Middleware,
        app: express.Application): void => middleware.init(app);

    /**
     * Joins the routing functionality to the server
     * @description express.Application Routes
     */
    private routesInit: Function = (routes: Router,
        app: express.Application): void => routes.init(app);

    /**
     * Sets port from the environment or the default one
     * @description sets port 3000 to default or unless otherwise specified in the environment
     */
    private setPort: Function = (app: express.Application): void => {
        app.set('port', process.env.PORT || 3000);
    }

    /**
     * @returns the server
     */
    public get app(): express.Application {
        return this.server;
    }
}
