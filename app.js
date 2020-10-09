const express = require('express');

const subtractController = require('./controller');
const validation = require('./validation');

const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/', validation, subtractController);

module.exports = app;
