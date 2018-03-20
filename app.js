var express = require('express');
var app = express();

// controllers
var fulfillmentController = require('./src/controllers/fulfillmentController');

// routes
app.use('/fulfillment', fulfillmentController);

module.exports = app;