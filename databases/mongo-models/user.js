'use strict';

const mongoose = require('mongoose');



let Schema = mongoose.Schema;

let userSchema = new Schema({
    fullName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    created_at: {
        type: Date,
    },
    confirm_at: {
        type: Date
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "post"
    }]
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


module.exports = mongoose.model('user', userSchema);
