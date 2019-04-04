"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function getUserProfile(req, res, next) {
  const connection = await mysqlPool.getConnection();
  const { uuid } = req.claims;

  try {
    const userProfile = await connection.query(`SELECT fullName, linkedIn, twitter, description FROM users
    WHERE uuid = '${uuid}'`);
    return res.status(200).send(userProfile[0]);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getUserProfile;
