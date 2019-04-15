'use strict';

const cloudinary = require('cloudinary').v2;
const path = require('path');

const cloudName = process.env.CLOUDINARI_CLOUD_NAME;
const apiKey = process.env.CLOUDINARI_API_KEY;
const apiSecret = process.env.CLOUDINARI_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const upload = async (id, file) => {

    try {

        let tempPath = path.join('./tmp', file.name)
        await file.mv(tempPath)

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(tempPath, (error, result) => {
                if (error) 
                    reject(error);
                else
                    resolve(result.secure_url);
            });
        });
    } catch (err) {
        throw err;
    }
}

module.exports = { upload };

