const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded());

// add some security-related headers to the response
app.use(helmet());

app.post('*', (req, res) => {
  require('./db/mongo')(req, res);
});

module.exports = app;
