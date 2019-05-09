const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../databases/mongo-models/user');
const ServerConfig = require("../../config/http-server-config");
const MailService = require('../services/mail-service');



const app = express();
 
/**
*Search the user in the database and check if the user has the authorization
*/
app.post('/api/login', async (req, res) => {
    
    try {
        const body = req.body;
        const userDb = await User.findOne({ email: body.email }).populate('avatar').exec();
        
        if (!userDb) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (userDb.deleted) return res.status(404).json({ message: 'Usuario no encontrado'});
        if (!bcrypt.compareSync(body.password, userDb.password)) return res.status(400).json({ message: 'Credenciales incorrectas' });
        
        const token = jwt.sign({ user: userDb }, ServerConfig.tokenSeed, { expiresIn: ServerConfig.tokenExpireTime });
        
        return res.status(200).json({
            user: userDb,
            token: token
        });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

/**
 * Re - send the email a new authorization for the user
 */
app.post('/api/login/refresh-link', async (req, res) => {

    try {

        const { email } = req.body;

        const userDB = await User.findOne({ email: email }).exec();

        if (!userDB) return res.status(404).json({ message: 'El usuario no existe' });
        
        const token = jwt.sign({ user: userDB }, ServerConfig.tokenSeed, { expiresIn: ServerConfig.tokenExpireTime });
        
        await MailService.sendAccountConfirmation(token, email);
        return res.status(200).send();
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
});


module.exports = app;