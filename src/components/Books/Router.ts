import express from 'express';
import BooksComponent from './BooksComponent';

/**
 * Class containing routs for the Books component
 */
export default class Router {
    /**
     * Express router to mount books related functions on.
     * @type {Express.Router}
     * @const
     */
    private booksRouter: express.Router;

    /**
     * Object containing methods for routs processing
     */
    private booksComponent: BooksComponent;

    /**
     * Class constructor
     */
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

    /**
     * The getter for the router
     */
    public get router(): express.Router {
        return this.booksRouter;
    }
}
