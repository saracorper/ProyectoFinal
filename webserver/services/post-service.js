"use strict";

const Joi = require("joi");

let validate = (req, res, next) => {
    try {
        let body = req.body;
        const schema = {
            picture: Joi.string().required(),
            description: Joi.string()
                .min(3)
                .max(1000),
            title: Joi.string()
        };

        const validation = Joi.validate(body, schema);
        if (validation.error) return res.status(400).json(validation.error);

        next();
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    validate
};