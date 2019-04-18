'use strict';

const sgMail = require('@sendgrid/mail');
const config = require('../../config/http-server-config')



let activateUser = async (userId, userEmail) => {  
    
  try {
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: userEmail,
        from: {
          email: "placadeplata@yopmail.com",
          name: "PlacaDePlata :)"
        },
        subject: "Heio",
        text: "Empieza a subir tus mejores fotos",
        html: `Para confirmar la cuenta <a href="${ config.frontDomain }/activateUser/${ userId }">activate it here</a>`
    };
    
    const data = await sgMail.send(msg); 
    return data;
  } catch (err) {
    throw err;
  }
};


module.exports = { activateUser };