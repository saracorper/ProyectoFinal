'use strict';

const config = {
    port: process.env.PORT || 3000,
    mongoDbUrl: 'mongodb://heroku_fm4rqtg4:rinkn951e2rlt6qmhrlkm53qkr@ds231956.mlab.com:31956/heroku_fm4rqtg4',
    tokenSeed: 'dev-seed',
    tokenExpireTime: '1h',
    sendgridApiKey: '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',
    frontDomain: 'http://localhost:4200'
};



module.exports = config;