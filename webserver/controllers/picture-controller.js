'use strict';

const Picture = require('../../databases/mongo-models/picture');
const fileUpload = require('express-fileupload');
const FileService = require('../services/file-service');


const express = require("express");

const JWTService = require("../services/jwt-service");


const app = express();
app.use(fileUpload());

app.post("/api/pictures", [ JWTService.validate ], async (req, res) => {

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


app.get("/api/pictures/:id", [ JWTService.validate ], async (req, res) => {

    try {
        let id = req.params.id;

        let picture = await Picture.findById(id).exec();

        if (!picture) {
            return res.status(404).json({
                message: 'No existe imagen'
            });
        }

        return res.status(200).json(picture);

    } catch (err) {
        return res.status(500).json({
            message: err
        }); 
    }
});

// app.get("/api/pictures/:id", [ JWTService.validate ], multerDownload.any())

// app.put()

module.exports = app;