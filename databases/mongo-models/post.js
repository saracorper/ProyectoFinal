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
    picture: {
        type: Schema.Types.ObjectId,
        ref: 'picture',
        required: true
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

    
    delete postObject.author.password;
    delete postObject.author.created_at;
    delete postObject.author.confirm_at;
    postObject.author.fullName = postObject.author.full_name;
    delete postObject.author.full_name;

    delete postObject.created_at;
    
    console.log('postObject :', postObject);
    return postObject;
}


module.exports = mongoose.model('post', postSchema);
