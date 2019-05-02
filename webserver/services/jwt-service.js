'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/http-server-config');


/**
 * Validates token
 * @param req 
 * @param res 
 * @param next 
 * @returns JSON - Describes if token is validated
 */
const validate = async (req, res, next) => {
    const token = req.get('JWTtoken'); 

    if (!token) {
        return res.status(401).json({ message: 'No token sent' });
    }

    try {
        const decoded = await jwt.verify(token, config.tokenSeed);
        req.user = decoded.user;
        next();
    } catch (e) {
        const msg = e.message || e;
        return res.status(401).json({ message: msg });
    }
}


module.exports = { validate };
