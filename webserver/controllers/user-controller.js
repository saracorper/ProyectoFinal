const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../../databases/mongo-models/user');
const UserService = require('../services/user-service');



const app = express();

app.post('/api-mongo/users', [ UserService.validate ], async (req, res) => {

    try {

        let body = req.body;
        let user = new User({
            email: body.email,
            password: bcrypt.hashSync(body.password, 10)
        });
    
        let newUserDb = await user.save();
        return res.json(newUserDb);
    } catch (err) {
        return res.status(400).json({ message: err });
    }
});


module.exports = app;