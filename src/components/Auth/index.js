/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthService = require('./service');
const AuthValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');

const ACCESS_TOKEN_EXPIRES_IN = '2h';

/**
 * Renders login page
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
const login = (req, res, next) => {
    try {
        res.status(200).render('auth/index', {
            csrfToken: req.csrfToken(),
            content: 'loginForm',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Generates jwt access token
 * @param {object} user
 * @returns {String} jwt access token
 */
const getAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
});

/**
 * Generates jwt refresh token
 * @param {object} user
 * @returns {String} jwt refresh token
 */
const getRefreshToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

/**
 * Authenticates user
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
const auth = async (req, res, next) => {
    try {
        const { error } = AuthValidation.create(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        let user = await AuthService.findByName({ name: req.body.name });

        if (!user) {
            user = await AuthService.create(req.body);
        }

        user = user.toObject();

        if (user.pass !== req.body.pass) {
            throw new Error('Wrong password');
        }

        const payload = {
            _id: user._id,
            name: user.name,
        };

        const refreshToken = getRefreshToken(payload);

        /* Save refresh token in database */
        AuthService.saveRefreshToken({ refreshToken });

        res.status(200).send({
            accessToken: getAccessToken(payload),
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Checks access token. If it is expired, throws an error
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.cookies.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || token === null) {
        res.status(401).render('errors/index', {
            error: '401',
            message: 'Authentication problem',
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
        if (error) {
            return res.status(403);
        }
        req.user = user;
        return next();
    });
};


/**
 * Checks refresh token. If it is ok, generates a pair of new access and refresh tokens
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
const refresh = async (req, res) => {
    const refreshHeader = req.cookies.refresh;
    const refreshToken = refreshHeader && refreshHeader.split(' ')[1];

    if (refreshToken === null) {
        return res.status(403);
    }

    try {
        /* Delete old refresh token from the database */
        const deleteResult = await AuthService.findAndDeleteRefreshToken(refreshToken);
        if (deleteResult === null) {
            /* If an old token was not found */
            throw new Error('Authentication problem');
        }

        const payload = {
            _id: jwt.decode(refreshToken)._id,
            name: jwt.decode(refreshToken).name,
        };

        const newAccessToken = getAccessToken(payload);
        const newRefreshToken = getRefreshToken(payload);

        /* Save new refresh token in database */
        await AuthService.saveRefreshToken({ refreshToken: newRefreshToken });

        return res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (deleteError) {
        return res.status(403).json({
            error: '403',
            message: deleteError.message[0].message,
        });
    }
};

module.exports = {
    auth,
    authenticateToken,
    login,
    refresh,
};
