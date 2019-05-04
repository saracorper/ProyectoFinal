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
        const { postId } = req.body;

        const postDB = await Post.findById(postId);

        if (!postDB) {
            return res.status(404).send({
                message: 'El post no existe'
            });
        }
        
        const purchase = new Purchase({
            buyer: userId,
            post: postId
        });

        let purchaseDB = await purchase.save();

        let buyer = await User.findById(userId).exec();

        buyer.purchases.push(purchaseDB._id);
        await buyer.save();

        let { author } = await Post.findById(postId).populate('author').exec();
        author.sales.push(purchaseDB._id);

        await author.save();

        return res.json(purchase);
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
