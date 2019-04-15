'use strict';

const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUDINARI_CLOUD_NAME;
const apiKey = process.env.CLOUDINARI_API_KEY;
const apiSecret = process.env.CLOUDINARI_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

const upload = async (id, data) => {

    let url = '';

    console.log('path :', data);

    // await cloudinary.uploader.upload(new Buffer(data).toString('base64'), {
    //   resource_type: 'raw',
    //   public_id: id,
    //   width: 200,
    //   height: 200,
    //   format: 'jpg',
    //   crop: 'limit'
    // })
    // .then(result => {
  
    //   console.log('result :', result);
    //   url = result.secure_url;
    // })
    // .catch(err => {
    //     throw err;
    // });

    await cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: id,
        width: 200,
        height: 200,
        format: "jpg",
        crop: "limit",
        async: true
      },
      async (err, result) => {
          if (err) throw err;

          url = result.secure_url;
      }).end(data);
    
    return url;
}

module.exports =  { upload };

