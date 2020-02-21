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
    async find(query) {
        return UserModel.find(query);
    },
    /**
     * @exports
     * @method create
     * @param {}
     * @summary create a user
     * @returns It should return the object of a new user but I wonder why it doesn't work
     */
    async create(email, fullName) {
        const user = new UserModel({ email, fullName });
        return user.save((error, result) => {
            if (error) {
                console.error('The error occured');
            }
            return result;
        });
    },
    /**
     * @exports
     * @method update
     * @param {}
     * @summary create a user
     * @returns the result of the update operation
     */
    async update(email, fullName) {
        return UserModel.updateMany({ email }, { $set: { fullName } });
    },
    /**
     * @exports
     * @method delete
     * @param {}
     * @summary create a user
     * @returns the result of the delete operation
     */
    async deleteUser(email) {
        return UserModel.deleteOne({ email });
    },
};
