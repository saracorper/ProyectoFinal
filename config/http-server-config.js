'use strict';

const config = {
    port: process.env.PORT || 3000,
    mongoDbUrl: 'mongodb://heroku_v0m8nk6x:e25ni31ttq5u1g6jgnmilrna4q@ds261342.mlab.com:61342/heroku_v0m8nk6x',
    tokenSeed: 'dev-seed',
    tokenExpireTime: '1d',
    frontDomain: 'http://localhost:4200'
};



module.exports = config;