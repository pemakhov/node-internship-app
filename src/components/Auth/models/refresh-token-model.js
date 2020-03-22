const { Schema } = require('mongoose');
const connections = require('../../../config/connection');

const RefreshTokenSchema = new Schema(
    {
        refreshToken: {
            type: String,
            trim: true,
            required: true,
            expires: '10s',
        },
        createAt: {
            type: Date,
            default: Date.now(),
            expires: '1d',
        },
    },
    {
        collection: 'refresh-token',
        versionKey: false,
    },
);

module.exports = connections.model('RefreshTokenModel', RefreshTokenSchema);
