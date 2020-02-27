const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');

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

        res.status(200).render('users/index', {
            users,
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).render({
            error: '500',
            message: error.message[0].message,
        });

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
async function findById(req, res, next) {
    try {
        const { error } = UserValidation.findById(req.params);

        if (error) {
            throw new ValidationError(error.details);
        }

        const user = await UserService.findById(req.params.id);

        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            return res.status(422).render('errors/index', {
                error: '422',
                message: error.message[0].message,
            });
        }

        res.status(500).render({
            error: '500',
            message: error.message[0].message,
        });

        return next(error);
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
        const { error } = UserValidation.create(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        UserService.create(req.body);

        return res.status(200).redirect('/v1/users');
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            return res.status(422).render('errors/index', {
                error: '422',
                message: error.message[0].message,
            });
        }

        res.status(500).render({
            error: '500',
            message: error.message[0].message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function updateById(req, res, next) {
    try {
        const { error } = UserValidation.updateById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        UserService.updateById(req.body.id, req.body);

        return res.status(200).redirect('/v1/users');
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            return res.status(422).render('errors/index', {
                error: '422',
                message: error.message[0].message,
            });
        }

        res.status(500).render({
            error: '500',
            message: error.message[0].message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function deleteById(req, res, next) {
    try {
        const { error } = UserValidation.deleteById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        UserService.deleteById(req.body.id);

        return res.status(200).redirect('/v1/users');
    } catch (error) {
        console.error(error);
        if (error instanceof ValidationError) {
            return res.status(422).render('errors/index', {
                error: '422',
                message: error.message[0].message,
            });
        }

        res.status(500).render({
            error: '500',
            message: error.message[0].message,
        });

        return next(error);
    }
}

module.exports = {
    findAll,
    findById,
    create,
    updateById,
    deleteById,
};
