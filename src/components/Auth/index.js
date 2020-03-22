/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthService = require('./service');
const AuthValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');

const ACCESS_TOKEN_EXPIRES_IN = '1h';

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
 * Parses user id from refresh token
 * @param {String} refreshToken
 */
const getUserId = (refreshToken) => jwt.decode(refreshToken)._id;

/**
 * Gets database user document for the provided ID
 * @param {String} userId
 */
const getUserFromDb = async (userId) => AuthService.findById(userId);

/**
 * Removes the first and the last char in the string
 * @param {String} string
 */
const stripQuotes = (string) => string.slice(1, -1);

/**
 * Gets user ID from provided user object
 * @param {String} user
 */
const getUserFromDbId = (user) => {
    const id = JSON.stringify(user._id);
    return stripQuotes(id);
};

/**
 * Checks access token. If it is expired, generates a pair of access and refresh tokens
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
            const refreshHeader = req.cookies.refresh;
            const refreshToken = refreshHeader && refreshHeader.split(' ')[1];

            if (refreshToken === null) {
                return res.sendstatus(403);
            }

            const userId = getUserId(refreshToken);
            const userFromDb = await getUserFromDb(userId);
            const userFromDbId = getUserFromDbId(userFromDb);

            if (userId !== userFromDbId) {
                return res.sendstatus(403);
            }

            const payload = {
                _id: userId,
                name: userFromDb.name,
            };

            const newAccessToken = getAccessToken(payload);
            const newRefreshToken = getRefreshToken(payload);

            return res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        }
        req.user = user;
        return next();
    });
};

module.exports = {
    auth,
    authenticateToken,
    login,
};
