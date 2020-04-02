const { Router } = require('express');
const BooksComponent = require('../Books');

/**
 * Express router to mount books related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving list of books.
 * @name /v1/books
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', BooksComponent.chart);

/**
 * Route serving world map view.
 * @name /v1/books/map
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/map', BooksComponent.map);

module.exports = router;
