require('dotenv').config({
    path: `${process.cwd()}/src/config/.env`,
});
const express = require('express');
const path = require('path');
const middleware = require('../config/middleware');
const routes = require('../config/router');


/**
 * @type {express}
 * @constant {express.Application}
 */
const app = express();

/**
 * @description sets view path
 */
app.set('views', path.join(__dirname, '..', 'views'));

/**
 * @description sets view engine
 */
app.set('view engine', 'ejs');

/**
 * @description sets the dirrectory for front-end files
 */
app.use(express.static(path.join(__dirname, '../public')));

/**
 * @description express.Application Middleware
 */
middleware.init(app);

/**
 * @description express.Application Routes
 */
routes.init(app);

/**
 * @description sets port 3000 to default or unless otherwise specified in the environment
 */
app.set('port', process.env.PORT || 3000);

module.exports = app;
