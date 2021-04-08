require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createPool({
    connectionLimit:5,
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

let db = {};

require('./student')(db, connection);
require('./class')(db, connection);
require('./course')(db, connection);

module.exports = db;
