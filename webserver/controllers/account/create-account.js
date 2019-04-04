"use strict";

const bcrypt = require("bcrypt");
const Joi = require("joi");
const sendgridMail = require("@sendgrid/mail");
const uuidV4 = require("uuid/v4");
const mysqlPool = require("../../../databases/mysql-pool");

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Insert the user into the database generating an uuid and calculating the bcrypt password
 * @param {String} email
 * @param {String} password
 * @return {String} uuid
 */
async function insertUserIntoDatabase(email, password, fullName, role) {
  const securePassword = await bcrypt.hash(password, 10);
  const uuid = uuidV4();
  const now = new Date();
  const createdAt = now
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");

  console.log("secure password", securePassword);
  console.log("createdAt", createdAt);
  console.log("uuid", uuid);

  const connection = await mysqlPool.getConnection();

  await connection.query("INSERT INTO users SET ?", {
    uuid,
    email,
    password: securePassword,
    created_at: createdAt,
    fullName,
    role
  });

  return uuid;
}

/**
 * @param {String} uuid
 * @param {String} verificationCode
 */
async function addVerificationCode(uuid) {
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
  const sqlQuery = "INSERT INTO users_activation SET ?";
  const connection = await mysqlPool.getConnection();

  await connection.query(sqlQuery, {
    uuid: uuid,
    verification_code: verificationCode,
    created_at: createdAt
  });

  connection.release();

  return verificationCode;
}

/**
 * Send an email with a verification link to the user to activate the account
 * @param {String} userEmail
 * @param {String} verificationCode
 * @return {Object} Sengrid response
 */
async function sendEmailRegistration(userEmail, verificationCode) {
  const msg = {
    to: userEmail,
    from: {
      email: "placadeplata@yopmail.com",
      name: "PlacaDePlata :)"
    },
    subject: "Welcome",
    text: "Empieza a subir tus mejores fotos",
    html: `To confirm the account <a href="${
      process.env.HTTP_SERVER_DOMAIN
    }/api/account/activate?verification_code=${verificationCode}">activate it here</a>`
  };

  const data = await sendgridMail.send(msg);

  return data;
}

async function validateSchema(payload) {
  /**
   * TODO: Fill email, password and full name rules to be (all fields are mandatory):
   *  email: Valid email
   *  password: Letters (upper and lower case) and number
   *    Minimun 3 and max 30 characters, using next regular expression: /^[a-zA-Z0-9]{3,30}$/
   * fullName: String with 3 minimun characters and max 128
   */
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    fullName: Joi.string()
      .min(3)
      .required(),
    role: Joi.string()
      .only("professional", "regular")
      .required()
  };

  return Joi.validate(payload, schema);
}

async function create(req, res, next) {
  const accountData = { ...req.body };

  /**
   * Validate if user data is valid to create an account
   * in other case, generate a 400 Bad Reqeust error
   */
  try {
    await validateSchema(accountData);
  } catch (e) {
    // Create validation error
    return res.status(400).send(e);
  }

  const { email, password, fullName, role } = accountData;

  try {
    /**
     * Create the user and send response
     */
    const uuid = await insertUserIntoDatabase(email, password, fullName, role);
    res.status(204).json();

    /**
     * Generate verification code and send email
     */
    try {
      const verificationCode = await addVerificationCode(uuid);
      await sendEmailRegistration(email, verificationCode);
    } catch (e) {
      console.error("Sengrid error", e);
    }
  } catch (e) {
    // create error
    next(e);
  }
}

module.exports = create;
