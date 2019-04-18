'use strict';

const config = {
    port: process.env.PORT || 3000,
    mongoDbUrl: 'mongodb://heroku_fm4rqtg4:rinkn951e2rlt6qmhrlkm53qkr@ds231956.mlab.com:31956/heroku_fm4rqtg4',
    tokenSeed: 'dev-seed',
    tokenExpireTime: '1h',
    frontDomain: 'http://localhost:4200'
};



module.exports = config;