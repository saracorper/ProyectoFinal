'use strict';

const mongoose = require('mongoose');



let Schema = mongoose.Schema;

let postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, 
        ref: "user",
        required: true
    },
    title: {
        type: String,
        default: 'title'
    },
    picture_url: {
        type: String,
        unique: true,
        required: [true, 'Picture is required'],
    },
    description: {
        type: String
    },
    created_at: {
        type: Date
    }
    
});

postSchema.methods.toJSON = function () {
    let post = this;
    let postObject = post.toObject();
    console.log('postObject :', postObject);

    postObject.pictureUrl = postObject.picture_url;
    postObject.createdAt = postObject.createdAt;
    
    delete postObject.picture_url;
    delete postObject.created_at;
    
    console.log('postObject :', postObject);
    return postObject;
}


module.exports = mongoose.model('post', postSchema);
