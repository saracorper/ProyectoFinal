'use strict';
const Picture = require("../../databases/mongo-models/picture");
const express = require("express");

const JWTService = require("../services/jwt-service");


// user multer

const app = express();

app.post( "/api-mongo/pictures", [JWTService.validate], async (req, res) => {
   try {
       const newPicture = new Picture({url: "jkhdfalhjdfljhafijadfl"});
       await newPicture.save();

       return res.json(newPicture);
   } catch (err) {
       return res.status(500).json({ msg: err.message })
   }
});

module.exports = app;