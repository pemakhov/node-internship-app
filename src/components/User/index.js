const UserService = require('./service');

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
    res.send(req.query);
    try {
        const { fullName } = req.body;
        const { newData } = req.body;
        const updatedUser = await UserService.update(fullName, newData);

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    findAll,
    find,
    create,
    update,
};
