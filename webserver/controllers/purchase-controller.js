'use strict';

const Purchase = require('../../databases/mongo-models/purchase');
const Post = require('../../databases/mongo-models/post');
const User = require('../../databases/mongo-models/user');
const JWTService = require('../services/jwt-service');

const express = require('express');


const app = express();

app.post('/api/users/:userId/purchases', [JWTService.validate], async (req, res) => {

    try {
        const userId = req.params.userId;
        const postIds = req.body.map(p => p.postId);
        
        const postDB = await Post.find({ _id: { $in: postIds } });
        
        if (!postDB) 
            return res.status(404).send({ message: 'El post no existe' }); 
        
        let purchases = [];
        postIds.forEach(id => {
            const purchase = new Purchase({
                buyer: userId,
                post: id
            });

            purchases.push(purchase);
        });

        let purchasesDB = await Purchase.insertMany(purchases);
        let purchaseDbIds = purchasesDB.map(p => p._id);

        let buyer = await User.findById(userId).exec();
        buyer.purchases = buyer.purchases.concat(purchaseDbIds);
        await buyer.save();

        return res.json(purchasesDB);
    } catch (err) {
        let msg = err.message || err;
        return res.status(500).json(msg);
    }
});

app.get('/api/users/:userId/purchases', [JWTService.validate], async (req, res) => {

    try {
        const userId = req.params.userId;
        const params = userId !== 'all' ? { buyer: userId } : {};

        let purchasesDB = await Purchase.find(params).populate('buyer').populate('post').exec();

        return res.status(200).json(purchasesDB);
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }

})

module.exports = app;
