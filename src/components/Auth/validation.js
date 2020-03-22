const Validation = require('../validation');

/**
 * @exports
 * @class
 * @extends Validation
 */
class AuthValidation extends Validation {
    /**
     * @param {String} data.id - objectId
     * @returns
     * @memberof AuthValidation
     */
    findById(data) {
        return this.Joi
            .object({
                id: this.Joi.objectId(),
            })
            .validate(data);
    }

    /**
     * @param {String} profile.name
     * @param {String} profile.pass
     * @returns
     * @memberof AuthValidation
     */
    create(profile) {
        return this.Joi
            .object({
                name: this.Joi
                    .string()
                    .min(1)
                    .max(30)
                    .required(),
                pass: this.Joi
                    .string()
                    .min(1)
                    .max(30)
                    .required(),
                _csrf: this.Joi.string(),
            })
            .validate(profile);
    }

    /**
     * @param {String} data.id - objectId
     * @returns
     * @memberof UserValidation
     */
    deleteById(data) {
        return this.Joi
            .object({
                id: this.Joi.objectId(),
                _csrf: this.Joi.string(),
            })
            .validate(data);
    }
}

module.exports = new AuthValidation();
