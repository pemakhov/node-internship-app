const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const csrf = require('csurf');
const express = require('express');

module.exports = {
    /**
     * @function
     * @description express middleware
     * @param {express.Application} app
     * @returns void
     */
    init(app) {
        app.use(
            bodyParser.urlencoded({
                extended: true,
            }),
        );
        app.use(bodyParser.json());
        // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
        app.use(cookieParser());
        // performs express use json from the body
        app.use(express.json());
        // performs csrf protection
        app.use(csrf({ cookie: true }));
        // returns the compression middleware
        app.use(compression());
        // helps you secure your Express apps by setting various HTTP headers
        app.use(helmet());
        // providing a Connect/Express middleware that
        // can be used to enable CORS with various options
        app.use(cors());
        // cors
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
            res.header('Access-Control-Allow-Credentials', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With,'
                + ' Content-Type, Accept,'
                + ' Authorization,'
                + ' Access-Control-Allow-Credentials',
            );
            next();
        });
        // sets view path
        app.set('views', path.join(__dirname, '..', 'views'));
        // sets view engine
        app.set('view engine', 'ejs');
        // sets the dirrectory for front-end files
        app.use(express.static(path.join(__dirname, '../public')));
    },
};
