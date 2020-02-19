const UserModel = require('./model');

module.exports = {
    /**
     * @exports
     * @method findAll
     * @param {}
     * @summary get list of all users
     * @returns Promise<UserModel[]>
     */
    async findAll() {
        return UserModel.find({});
    },
    async createUser(email, fullName) {
        const user = new UserModel({ email, fullName });
        user.save();
    },
};
