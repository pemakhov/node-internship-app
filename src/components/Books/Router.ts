import express from 'express';
import BooksComponent from './BooksComponent';

export default class Router {
    /**
     * Express router to mount books related functions on.
     * @type {Express.Router}
     * @const
     */
    private booksRouter: express.Router;

    private booksComponent: BooksComponent;

    constructor() {
        this.booksRouter = express.Router();
        this.booksComponent = new BooksComponent();
        /**
         * Route serving list of books.
         * @name /v1/books
         * @function
         * @inner
         * @param {string} path - Express path
         * @param {callback} middleware - Express middleware.
         */
        this.booksRouter.get('/', this.booksComponent.chart);
    }

    public get router(): express.Router {
        return this.booksRouter;
    }
}
