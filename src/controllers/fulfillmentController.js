var express = require('express');
var bodyParser = require('body-parser');

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;

const NAME_ACTION = 'make_name';
const COLOR_ARGUMENT = 'color';
const NUMBER_ARGUMENT = 'number';

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// var fulfillment = require('../models/fulfillment');

router.post('/', function (request, response) {
    console.log('request headers: ' + JSON.stringify(request.headers));
    console.log('request body: ' + JSON.stringify(request.body));

    const app = new App({request, response});

    function makeName (app) {
        let number = app.getArgument(NUMBER_ARGUMENT);
        let color = app.getArgument(COLOR_ARGUMENT);
        console.log(number);
        console.log(color);
        app.tell('Alright, your silly name is ' +
        color + ' ' + number +
        '! I hope you like it. See you next time.');
    }
    let actionMap = new Map();
    actionMap.set(NAME_ACTION, makeName);

    app.handleRequest(actionMap);
});

module.exports = router;