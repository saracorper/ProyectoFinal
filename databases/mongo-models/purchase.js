'use strict';

const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
});

module.exports = mongoose.model('purchase', purchaseSchema);