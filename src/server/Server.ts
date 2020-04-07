import express from 'express';
import Middleware from '../config/Middleware';
import Router from '../config/Router';

export default class Server {
    /**
     * @type {express}
     * @constant {express.Application}
     */
    private server: express.Application;

    constructor(expressApp: express.Application, middleware: Middleware, routes: Router) {
        this.server = expressApp;
        this.middlewareInit(middleware, this.server);
        this.routesInit(routes, this.server);
        this.setPort(this.server);
    }

    /**
     * @description express.Application Middleware
     */
    private middlewareInit = (middleware, app: express.Application): void => middleware.init(app);

    /**
     * @description express.Application Routes
     */
    private routesInit = (routes, app: express.Application): void => routes.init(app);

    /**
     * @description sets port 3000 to default or unless otherwise specified in the environment
     */
    private setPort = (app: express.Application): void => {
        app.set('port', process.env.PORT || 3000);
    }

    public get app(): express.Application {
        return this.server;
    }
}
