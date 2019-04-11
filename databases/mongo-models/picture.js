'use strict';
const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let pictureSchema = new Schema({
    url: {
        type: String,
        unique: true,
        required: [true, 'Url is required'],
    }
    
});

// pictureSchema.methods.toJSON = function () {
//     let picture = this;
//     let pictureObject = picture.toObject();
//     console.log('pictureObject :', pictureObject);

//     pictureObject.pictureUrl = pictureObject.picture_url;
    
    
//     console.log('pictureObject :', pictureObject);
//     return pictureObject;
// }


module.exports = mongoose.model('picture', pictureSchema);