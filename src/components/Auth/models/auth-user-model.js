const { Schema } = require('mongoose');
const connections = require('../../../config/connection');

const AuthUserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        pass: {
            type: String,
            trim: true,
            required: true,
        },
    },
    {
        collection: 'auth',
        versionKey: false,
    },
);

module.exports = connections.model('AuthUserModel', AuthUserSchema);
