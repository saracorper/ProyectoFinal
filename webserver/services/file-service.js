'use strict';

const cloudinary = require('cloudinary').v2;
const path = require('path');
var fs = require('fs');

const cloudName = process.env.CLOUDINARI_CLOUD_NAME;
const apiKey = process.env.CLOUDINARI_API_KEY;
const apiSecret = process.env.CLOUDINARI_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/**
 * Uploads image to cloudinary
 * @param {string} id 
 * @param {object} file 
 * @returns {Promise} URL valid
 */
const upload = async (id, file) => {
    
    let tempPath = path.join('./tmp', file.name)

    try {

        await file.mv(tempPath)
        
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                tempPath, 
                {
                    resource_type: 'raw',
                    public_id: id,
                    format: 'jpg',
                    crop: 'limit',
                },
                (error, result) => {
                    fs.unlinkSync(tempPath); // Delete file from temp dir
                    if (error) 
                        reject(error);
                    else
                        resolve(result.secure_url);
                });
                
        });
        


    } catch (err) {
        fs.unlinkSync(tempPath);
        throw err;
    }
}

module.exports = { upload };

