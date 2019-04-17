const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../../databases/mongo-models/user');
const UserService = require('../services/user-service');
const JWTService = require('../services/jwt-service');
const { activateUser } = require ('../services/mail-service');


const app = express();

app.post('/api/users', [ UserService.validate ], async (req, res) => {

    try {

        let body = req.body;
        let user = new User({
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            created_at: new Date()
        });
    
        let newUserDb = await user.save();

        let mailData = await activateUser(user.id, user.email);
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
        let confirm_at = body.confirm_at;

        userDB.fullName = (fullName)? fullName: userDB.fullName;
        userDB.confirm_at = (confirm_at)? confirm_at: userDB.confirm_at;

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

