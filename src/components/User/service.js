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
    async update(query, newData) {
        return UserModel.update(query, newData);
    },
    async delete() {
        const result = {};
        return result;
    },
};
