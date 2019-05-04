'use strict';

const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
})

purchaseSchema.methods.toJSON = function () {

    let purchase = this;
    let purchaseObject = purchase.toObject();
    console.log('purchaseObject :', purchaseObject);
    
    purchaseObject.postId = purchaseObject.post_id;
    delete purchaseObject.post_id;

    return purchaseObject;
}

module.exports = mongoose.model('purchase', purchaseSchema);