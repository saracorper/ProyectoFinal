'use strict';
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    url: {
        type: String,
        unique: false,
        default:''
    }
});

// pictureSchema.methods.toJSON = function () {
//     let picture = this;
//     let pictureObject = picture.toObject();

//     pictureObject.pictureUrl = pictureObject.picture_url;

//     return pictureObject;
// }


module.exports = mongoose.model('picture', pictureSchema);