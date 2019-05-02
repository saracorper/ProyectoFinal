'use strict';

const User = require('../../databases/mongo-models/user')
const Post = require('../../databases/mongo-models/post');
const PostService = require('../services/post-service');
const JWTService = require('../services/jwt-service');
const express = require('express');


const app = express();

/**
 *
 Check user and insert a new post in the database
 */
app.post('/api/users/:userId/posts', [ JWTService.validate, PostService.validate ], async (req, res) => {

    try {
        const userId = req.params.userId;

        let userDB =  await User.findById(userId);

        if(!userDB) {
            return res.status(404).send({ message: ' El usuario no existe'});
        }

        const body = req.body;
        let post = new Post({
           author: userId, 
           picture: body.picture,
           description: body.description,
           created_at: new Date()
        });

        if (body.title) post.title = body.title;
        await post.save();

        userDB.posts.push(post._id);
        await userDB.save();

        return res.json(post);
    } catch (err) {
        const msg = err.message || err;
        return res.status(500).json(msg);
    }
});

/**
 *Search post and update a post's information in the database
 */
app.put('/api/users/:userId/posts/:id', [ JWTService.validate, PostService.validate ], async (req, res) => {

    try {
        const body = req.body;
        const id = req.params.id;
        const author = req.params.userId;

        let postDB = await Post.findOne({_id: id, author: author}).exec();

        if(!postDB) {
            return res.status(404).json({ message: 'El post no existe' });
        }

        let description = body.description;
        let title = body.title;

        postDB.description = (description)? description: postDB.description;
        postDB.title = (title)? title: postDB.title;

        await postDB.save();
        return res.status(200).json(postDB);
        
    } catch (err) {
        let msg = err.message || err;
        return res.status(500).json(msg);
    }
});

/**
 *Search for a post in the database by the id
 */
app.get('/api/users/:userId/posts/:id', [JWTService.validate], async (req, res) => {

    try {
        const id = req.params.id;

        const post = await Post.findById(id).populate("author").populate("picture").exec();

        if(!post) {
            return res.status(404).json({ message: 'El post no existe' });
        }
        
        // delete post.author.posts;
        return res.status(200).json(post);

    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

/**
 * Search all post in de database
 */
app.get('/api/users/:userId/posts', [ JWTService.validate ], async (req, res) => {

    try {
        const userId = req.params.userId;
        let params = userId !== 'all'? { author : userId } : {};

        let postsDB = await Post.find(params).populate('picture').exec();
        
        return res.status(200).json(postsDB);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

/**
 * Delete post from the database
 */
app.delete('/api/users/:userId/posts/:id', [JWTService.validate], async (req, res) => {
    try {
        const id = req.params.id;
        
        const postDB = await Post.deleteOne(id).exec();

        if (!postDB) {
            return res.status(404).send({message: "El post no existe"});
        }

        postDB.deleted = true;
        
        await postDB.save();

        return res.status(200).send();
    } catch (err) {
        const msg = err.message || err;
        return res.status(500).json(msg);
    }
});


module.exports = app;