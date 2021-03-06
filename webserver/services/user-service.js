"use strict"

const Joi = require("joi");


/**
 * Validate if user data is valid to create an account
 * @param req 
 * @param res 
 * @param next 
 * @returns {object} - returns the checked info of body
 */
const validate = (req, res, next) => {
    
    try {
        const body = req.body;
        const schema = {
            email: Joi.string()
                .email({ minDomainAtoms: 2 })
                .required(),
            password: Joi.string()
                .regex(/^[a-zA-Z0-9]{3,30}$/)
                .required()
        };

        const validation = Joi.validate(body, schema);
        if (validation.error) return res.status(400).json(validation.error);

        next();
    } catch (err) {
        return res.status(500).json(err);
    }
}

module.exports = {
    validate
};
