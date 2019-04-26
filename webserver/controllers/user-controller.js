const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../../databases/mongo-models/user');
const UserService = require('../services/user-service');
const ServerConfig = require('../../config/http-server-config')
const JWTService = require('../services/jwt-service');
const { sendAccountConfirmation } = require ('../services/mail-service');


const app = express();

app.post('/api/users', [ UserService.validate ], async (req, res) => {

    try {

        let body = req.body;
        const existingUser= await User.findOne({email: body.email});

        if(existingUser) return res.status(400).json({ message:'El email ya existe' });

        let user = new User({
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            created_at: new Date()
        });
    
        let newUserDb = await user.save();

        let token = jwt.sign({ user: newUserDb }, ServerConfig.tokenSeed, { expiresIn: ServerConfig.tokenExpireTime });
        await sendAccountConfirmation(token, user.email);
        return res.json(newUserDb);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

//update
app.put('/api/users/:id',[ JWTService.validate ], async(req, res) => {

    try {

        let body = req.body;
        let id = req.params.id;

        let userDB = await User.findById(id).exec();

        if(!userDB) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }
         
        let fullName = body.fullName;
        let confirmAt = body.confirmAt;
        const email = body.email;

        userDB.full_name = (fullName)? fullName: userDB.full_name;
        userDB.confirm_at = (confirmAt)? confirmAt: userDB.confirm_at;
        userDB.email = (email)? email: userDB.email;

        await userDB.save();
        return res.status(200).json(userDB);
        
    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

app.get('/api/users/:id',[ JWTService.validate ], async(req, res) => {

    try {
        let id = req.params.id;

        let user = await User.findById(id).populate({path: 'posts', model: 'post'}).exec();

        if(!user) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }
        
        return res.status(200).json(user);

    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

app.get('/api/users',[ JWTService.validate ], async(req, res) => {

    try {

        let usersDB = await User.find({}).exec();
        
        return res.status(200).json(usersDB);

    } catch (err) {
        return res.status(400).json({ message: err });
    }
});



module.exports = app;

