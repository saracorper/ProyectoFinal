const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../databases/mongo-models/user');
const ServerConfig = require("../../config/http-server-config");



const app = express();


app.post('/api/login', async (req, res) => {

    try {
        let body = req.body;
        let userDb = await User.findOne({ email: body.email }).exec();

        if (!userDb) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (!bcrypt.compareSync(body.password, userDb.password)) return res.status(400).json({ message: 'Contraseña incorrecta' });

        let token = jwt.sign({ user: userDb }, ServerConfig.tokenSeed, { expiresIn: ServerConfig.tokenExpireTime });
    
        return res.status(200).json({
            user: userDb,
            token: token
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});


module.exports = app;