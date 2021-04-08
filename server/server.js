const express = require('express');
const cors = require('cors')
const router = require('./routes');

const app = express();

// Server object
var server = {
  port: 4000
};

// Tell express to use decs
app.use(express.json());
app.use(cors())
app.use('/api', router);

// Start server
app.listen( process.env.PORT || server.port , () => console.log(`Server started, listening port: ${process.env.PORT || server.port}`));