'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/http-server-config');

let validate = async (req, res, next) => {
  const token = req.get('JWTtoken'); // nombre a poner en postman

  if (!token) {
    return res.status(401).send();
  }

  try {

    jwt.verify(token, config.tokenSeed, (err, decoded) => {
      
      if (err) {
        return res.status(401).send();
      }

      req.user = decoded.user; 
      next();
    });

  } catch (e) {
    return res.status(401).send();
  }
}


module.exports = {validate};
