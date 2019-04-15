'use strict';
const Picture = require('../../databases/mongo-models/picture');
const fileUpload = require('express-fileupload');
const fileService = require('../services/file-service');


const express = require("express");

const JWTService = require("../services/jwt-service");

// use multer

const app = express();
app.use(fileUpload());

app.post( "/api-mongo/pictures", [ JWTService.validate ], async (req, res) => {
   try {      
        
        const files = req.files;

        // if (!files) return bad request con mensaje no hay ficheros
        if(!files || !files.picture) {
            res.status(404).send({message: 'No hay imagen'});
        }

        let newPicture = new Picture();
        await newPicture.save();

        // console.log('files.picture :', files.picture);
        // aqui invocar fileService.upload(id, data)
        let pictureUrl = await fileService.upload(newPicture._id, files.picture.data)
        console.log('pictureUrl :', pictureUrl);

       // actualizar newPicture.url
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