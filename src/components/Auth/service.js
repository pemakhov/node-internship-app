const AuthUserModel = require('./models/auth-user-model');
const RefreshTokenModel = require('./models/refresh-token-model');

/**
 * @exports
 * @method findById
 * @param {string} id
 * @summary get a user
 * @returns {Promise<AuthUserModel>}
 */
function findById(id) {
    return AuthUserModel.findById(id).exec();
}

/**
 * @exports
 * @method findById
 * @param {string} id
 * @summary get a user
 * @returns {Promise<AuthUserModel>}
 */
function findByName(name) {
    return AuthUserModel.findOne(name).exec();
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<AuthUserModel>}
 */
function create(profile) {
    return AuthUserModel.create(profile);
}

/**
 * @exports
 * @method deleteById
 * @param {string} _id
 * @summary delete a user from database
 * @returns {Promise<void>}
 */
function deleteById(_id) {
    return AuthUserModel.deleteOne({ _id }).exec();
}

/**
 * @exports
 * @method createRefreshToken
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<AuthUserModel>}
 */
function saveRefreshToken(token) {
    return RefreshTokenModel.create(token);
}

/**
 * @exports
 * @method findAndDeleteRefreshToken
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<AuthUserModel>}
 */
function findAndDeleteRefreshToken(refreshToken) {
    return RefreshTokenModel.findOneAndDelete({ refreshToken });
}

module.exports = {
    findById,
    findByName,
    create,
    deleteById,
    saveRefreshToken,
    findAndDeleteRefreshToken,
};
