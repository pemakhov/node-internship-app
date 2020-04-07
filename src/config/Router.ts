import express from 'express';
import http from 'http';
import BooksRouter from '../components/Books/Router';

export default class Router {
    private booksRouter: express.Router;

    constructor() {
        this.booksRouter = new BooksRouter().router;
    }

    /**
     * @function
     * @param {express.Application} app
     * @summary init Application router
     * @returns void
     */
    init(app: express.Application): void {
        const router: express.Router = express.Router();

        /**
         * Forwards any requests to the /v1/books URI to BooksRouter.
         * @name /v1/books
         * @function
         * @inner
         * @param {string} path - Express path
         * @param {callback} middleware - Express middleware.
         */
        app.use('/v1/books', this.booksRouter);

        /**
         * Sets public files dirrectory
         * @function
         * @inner
         * @param {callback} middleware - Express middleware.
         */
        app.use(express.static('public'));

        /**
         * @description No results returned mean the object is not found
         * @function
         * @inner
         * @param {callback} middleware - Express middleware.
         */
        app.use((req: express.Request, res: express.Response) => {
            res.status(404).send(http.STATUS_CODES[404]);
        });

        /**
         * @function
         * @inner
         * @param {express.Router}
         */
        app.use(router);
    }
}
