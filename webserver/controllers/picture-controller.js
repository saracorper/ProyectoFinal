'use strict';

const Picture = require('../../databases/mongo-models/picture');
const fileUpload = require('express-fileupload');
const FileService = require('../services/file-service');


const express = require("express");

const JWTService = require("../services/jwt-service");


const app = express();
app.use(fileUpload());


/**
 *Create a new picture and insert in the database
 */
app.post("/api/pictures", [ JWTService.validate ], async (req, res) => {

    try {

        if (!req.files || !req.files.picture) 
            return res.status(404).send({ message: 'No hay imagen' });
            
        const newPicture = new Picture();
        await newPicture.save();

        const picture = req.files.picture;
        const pictureUrl = await FileService.upload(newPicture._id, picture)

        newPicture.url = pictureUrl;
        await newPicture.save();

        return res.json(newPicture);
        
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
});

/**
 *Search picture in the database by the id
 */
app.get("/api/pictures/:id", [ JWTService.validate ], async (req, res) => {

    try {
        const id = req.params.id;

        const picture = await Picture.findById(id).exec();

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

/**
 *Search picture and update a picture's information in the database
 */
app.put("/api/pictures/:id", [JWTService.validate ], async (req, res) => {
    try {

        const id = req.params.id;

        if (!req.files || !req.files.picture)return res.status(404).send({message: 'No hay imagen'});

        let pictureDB =  await Picture.findById(id);
        if(!pictureDB ) return res.status(404).json({ message: 'No existe imagen'});

        let pictureUrl = await FileService.upload(pictureDB._id, req.files.picture);

        pictureDB.url = pictureUrl;
        
        await pictureDB.save();
        return res.status(200).json(pictureDB);
        
    } catch (err) {
        const msg = err.message || err;
        return res.status(500).json(msg);
    }
});



module.exports = app;