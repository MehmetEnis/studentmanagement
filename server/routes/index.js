const express = require('express');
const { response } = require('express');
const router = express.Router();
const db = require('../db');

require('./course')(router, db);
require('./class')(router, db);
require('./student')(router, db);

module.exports = router;