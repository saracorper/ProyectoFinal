"use strict";

require('./databases/mongo-models/user');

require("dotenv").config();
const webServer = require("./webserver");
const httpServerConfig = require("./config/http-server-config");
// const mysqlPool = require("./databases/mysql-pool");
const mongoose = require('mongoose');


process.on("uncaughtException", err => {
    console.error("excepción inesperada", err.message, err);
});

process.on("unhandledRejection", err => {
    console.error("Error inesperado", err.message, err);
});

/**
 * Initialize dependencies
 * */
(async function initApp() {
    try {
    // await mysqlPool.connect();
        let dbName = 'heroku_fm4rqtg4';
        mongoose.connect(httpServerConfig.mongoDbUrl, { useNewUrlParser: true }, (err, res) => {
            if (err)
                throw err;

            console.log(`Successfully connected to database: ${dbName}`);
        });

        await webServer.listen(httpServerConfig.port);
        console.log(`server running at: ${httpServerConfig.port}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();