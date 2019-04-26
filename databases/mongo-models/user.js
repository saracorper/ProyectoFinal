'use strict';

const mongoose = require('mongoose');



let Schema = mongoose.Schema;

let userSchema = new Schema({
    full_name: {
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
    }],
    avatar: {
        type: Schema.Types.ObjectId,
        ref:"picture"
    }
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    userObject.fullName = userObject.full_name;

    delete userObject.password;
    delete userObject.created_at;
    delete userObject.confirm_at;
    delete userObject.full_name;
    

    return userObject;
}


module.exports = mongoose.model('user', userSchema);
