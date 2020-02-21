const Joi = require('@hapi/joi');

/**
 * Validation rooles
 */
const schema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: false } }),
    fullName: Joi.string()
        /**
         * @fullName - should consist of from one to four words;
         * each word can contain word charachters and '
         */
        .pattern(/^(\b(\w|')+(\s|\b)){1,4}$/),
});

module.exports = schema;
