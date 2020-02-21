const UserService = require('./service');
const Joi = require('./validation');

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAll(req, res, next) {
    try {
        const users = await UserService.findAll();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function find(req, res, next) {
    try {
        const { query } = req;
        const validationError = Joi.validate(query).error;
        if (validationError) {
            res.status(400).json(validationError.details[0].message);
            return;
        }
        const users = await UserService.find(query);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function create(req, res, next) {
    try {
        const validationError = Joi.validate(req.body).error;
        if (validationError) {
            res.status(400).json(validationError.details[0].message);
            return;
        }
        const { email } = req.body;
        const { fullName } = req.body;
        const newUser = await UserService.create(email, fullName);

        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function update(req, res, next) {
    try {
        const validationError = Joi.validate(req.body).error;
        if (validationError) {
            res.status(400).json(validationError.details[0].message);
            return;
        }
        const { email } = req.body;
        const { fullName } = req.body;
        const updatedUser = await UserService.update(email, fullName);

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function deleteUser(req, res, next) {
    try {
        const validationError = Joi.validate(req.body).error;
        if (validationError) {
            res.status(400).json(validationError.details[0].message);
            return;
        }
        const { email } = req.body;
        const deleted = await UserService.deleteUser(email);

        res.status(200).json(deleted);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    findAll,
    find,
    create,
    update,
    deleteUser,
};
