const { Schema } = require('mongoose');
const connections = require('../../config/connection');

/**
 * Schema of user data
 */
const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
    },
    fullName: {
        type: String,
        trim: true,
    },
}, {
    collection: 'usermodel',
    versionKey: false,
});

module.exports = connections.model('UserModel', UserSchema);
