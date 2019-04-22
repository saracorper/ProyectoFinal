'use strict';

const sgMail = require('@sendgrid/mail');
const config = require('../../config/http-server-config')
var nodemailer = require('nodemailer'); // email sender function 



let sendAccountConfirmation = async (token, userEmail) => {  
    
  try {

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'luapernas@gmail.com',
        pass: 'Lolailo19'
      }
    });

    var mailOptions = {
      from: {
              email: 'placadeplata@yopmail.com',
              name: 'PlacaDePlata :)'
            },
      to: userEmail,
      subject: 'Heio',
      
      html: `Para confirmar la cuenta <a href="${ config.frontDomain }/activate-account?token=${ token }">activate it here</a>`
    };

    const data = await transporter.sendMail(mailOptions);
    console.log(data);
    
  } catch (err) {
    throw err;
  }
};


module.exports = { sendAccountConfirmation };