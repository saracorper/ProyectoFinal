'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/http-server-config');

let validate = async (req, res, next) => {
    const token = req.get('JWTtoken'); // nombre a poner en postman

    if (!token) {
        return res.status(401).json({ message: 'No token sent' });
    }

    try {
        let decoded = await jwt.verify(token, config.tokenSeed);
        req.user = decoded.user;
        next();
    } catch (e) {
        let msg = e.message || e;
        return res.status(401).json({ message: msg });
    }
}


module.exports = { validate };
