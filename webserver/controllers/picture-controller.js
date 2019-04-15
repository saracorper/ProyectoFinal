'use strict';
const Picture = require('../../databases/mongo-models/picture');
const fileUpload = require('express-fileupload');
const FileService = require('../services/file-service');


const express = require("express");

const JWTService = require("../services/jwt-service");


const app = express();
app.use(fileUpload());

app.post("/api-mongo/pictures", [ JWTService.validate ], async (req, res) => {

    try {
        if (!req.files || !req.files.picture) 
            return res.status(404).send({ message: 'No hay imagen' });

        let newPicture = new Picture();
        await newPicture.save();

        let picture = req.files.picture;
        let pictureUrl = await FileService.upload(newPicture._id, picture)

        newPicture.url = pictureUrl;
        await newPicture.save();

        return res.json(newPicture);
    } catch (err) {
        console.log('err :', err);
        return res.status(500).json({ msg: err.message })
    }
});

// app.get("/api-mongo/pictures/:id", [ JWTService.validate ], multerDownload.any())

// app.put()

module.exports = app;