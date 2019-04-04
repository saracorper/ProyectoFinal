"use strict";

const mysqlPool = require("../../../databases/mysql-pool");

async function validateSchema(payload) {
  /**
   * TODO: Fill email, password and full name rules to be (all fields are mandatory):
   *  email: Valid email
   *  password: Letters (upper and lower case) and number
   *    Minimun 3 and max 30 characters, using next regular expression: /^[a-zA-Z0-9]{3,30}$/
   * fullName: String with 3 minimun characters and max 128
   */
  const schema = {
    fullName: Joi.string()
      .min(3)
      .required(),
    linkedIn: Joi.string(),
    twitter: Joi.string(),
    description: Joi.string().max(800)
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  const connection = await mysqlPool.getConnection();
  const { uuid } = req.claims;
  const profileData = { ...req.body };
  debugger;
  try {
    const { fullName, linkedIn, avatar_url, description } = profileData;
    console.log(fullName, linkedIn, avatar_url, description);
    //  " update users set fullName=${} where uuid=374745338494r94";
    const mySqlQuery = `UPDATE users
    SET fullName = '${fullName}', linkedIn = '${linkedIn}', 
    twitter = '${twitter}', description = '${description}' 
    WHERE uuid ='${uuid}'`;
    connection.query(mySqlQuery);

    return res.status(204).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = updateUserProfile;
