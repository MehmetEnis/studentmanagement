require('dotenv').config();
var mysql = require('mysql');
var migration = require('mysql-migrations');

const connection = mysql.createPool({
    connectionLimit:5,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

migration.init(connection, __dirname + '/db/migrations');