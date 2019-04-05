"use strict"

const Joi = require("joi");

let validate = (req, res, next) => {
    
    try {
        let body = req.body;
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
}