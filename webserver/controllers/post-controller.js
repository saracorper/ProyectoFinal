'use strict';

const User = require('../../databases/mongo-models/user')
const Post = require('../../databases/mongo-models/post');
const PostService = require('../services/post-service');
const JWTService = require('../services/jwt-service');
const express = require('express');


const app = express();

app.post('/api-mongo/users/userId/posts', [ JWTService.validate, PostService.validate ], async (req, res) => {

    try {
        let userId = req.params.userId;
        const userDB =  await User.findById(userId);

        if(!userDB) {
            return res.status(404).send({ message: ' El usuario no existe'});
        }

        let body = req.body;
        let post = new Post({
           author: userId, 
           picture_url: body.pictureUrl,
           created_at: new Date()
        });

        if (body.title) post.title = body.title;
        await post.save();

        userDB.posts.push(post._id);
        await userDB.save();

        return res.json(post);
    } catch (err) {
        let msg = err.message || err;
        return res.status(500).json(msg);
    }
});

app.put('/api-mongo/users/:userId/posts/:id', [ JWTService.validate, PostService.validate ], async (req, res) => {

    try {
        let body = req.body;
        let id = req.params.id;
        let author = req.params.userId;

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

app.get('/api-mongo/users/:userId/posts/:id', async(req, res) => {

    try {
        let id = req.params.id;

        let post = await Post.findById(id).populate("author").exec();

        if(!post) {
            return res.status(404).json({ message: 'El post no existe' });
        }
        
        // delete post.author.posts;
        return res.status(200).json(post);

    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

app.get('/api-mongo/users/:userId/posts', async(req, res) => {

    try {
        let userId = req.params.userId;
        let params = userId? { author : userId } : {};

        let postsDB = await Post.find(params).exec();
        
        return res.status(200).json(postsDB);

    } catch (err) {
        return res.status(400).json({ message: err });
    }
});



app.delete('/api-mongo/users/:userId/posts/:id', async(req, res) => {
    try {
        const id = req.params.id;
        
        const post = await Post.deleteOne(id).exec();

        if (!post) {
            return res.status(404).send({message: "El post no existe"});
        }

        //hacer borrado logico añadiendop a post la propiedad 'borrado : true'

        return res.status(200).send({message: "Post eliminado"})
    } catch (err) {
        return res.status(500).send({message: err});
    }
});


module.exports = app;