const { Router } = require('express');
const AuthComponent = require('../Auth');

/**
 * Express router to mount auth related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route getting a login page
 * @name /v1/auth
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/', AuthComponent.login);

/**
 * Route serving a new auth user
 * @name /v1/auth
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/authenticate', AuthComponent.auth);

module.exports = router;
