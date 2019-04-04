"use strict";

const Joi = require("joi");
const mysqlPool = require("mysql2");

async function validate(payload) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(1024)
      .required(),
    picture_prize: Joi.number()
      .positive()
      .precision(2)
      .required()
  };

  // no validar la foto

  return Joi.validate(payload, schema);
}

async function createPost(req, res, next) {
  const { uuid } = req.claims;
  const pictureData = { ...req.body };

  try {
    await validate(pictureData);
  } catch (error) {
    return res.status(400).send(error);
  }

  const data = {
    title: pictureData.title,
    picture_prize: pictureData.picture_prize,
    picture_url: pictureData.picture_url
  };

  const connection = await mysqlPool.getConnection();
  // validar y subir foto con cloudinary

  //insertar los 3 datos en base de datos
  try {
    const pictureCreated = await connection.query(
      `INSERT INTO picture SET ?`,
      {
        title,
        picture_prize,
        picture_url
      }`WHERE uuid = '${uuid}'`
    );
    return res.status(201).send(pictureCreated);
  } catch (error) {
    return res.status(500).send(e.message);
  }
}

module.exports = createdPicture;
