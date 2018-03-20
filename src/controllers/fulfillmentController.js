var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var Root = require('../../root-insurance-node');


const APP_ID = ''
const APP_TOKEN = ''


process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;

const GADGET_ACTION = 'DefaultWelcomeIntent.DefaultWelcomeIntent-yes.DefaultWelcomeIntent-yes-custom';
const COVER_ACTION = 'DefaultWelcomeIntent.DefaultWelcomeIntent-yes.DefaultWelcomeIntent-yes-custom.Intent-yes-phone-custom';
const GADGET = 'gadget';

const gadget_obj = {iPhone : 'iPhone 7 Plus 256GB LTE', Redmi3 : "Redmi 3 32GB LTE - Gold"}
const cover_obj = {theft : 'theft', full_cover : "full cover"}
const quote_url = "https://sandbox.root.co.za/v1/insurance/quotes"

let client = new Root.InsuranceAPI(APP_ID, APP_TOKEN)

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function (request, response) {
    console.log('request headers: ' + JSON.stringify(request.headers));
    console.log('request body: ' + JSON.stringify(request.body));

    const app = new App({request, response});


    function HandleGadget (app) {
        let gadget = app.getArgument(GADGET);
        console.log("FOUND", gadget);
        console.log(gadget_obj[gadget]);
        const options = { type: 'root_gadgets', model_name: gadget_obj[gadget] }
        client.createQuote(options).then((quote) => {
          console.log(quote);
          var text = 'OK, your quote is R ' + (quote[0].base_premium / 100).toString() + ' per month. Do you want full cover or just theft?';
          response.status(200)
          .json(
          {
              "speech": text,
              "displayText": text
           });
          // app.tell( 'OK, your quote is R ' + (quote[0].base_premium / 100).toString() + ' per month. Do you want full cover or just theft?');
      }).catch((err) => {
          console.log(err);
      })
    }

    function HandleCoverType (app) {
        let cover = app.getArgument("cover_type");
        console.log("FOUND", cover);
        // var text = 'OK, setting your cover to  ' + (cover_obj[cover]).toString();
        response.status(200)
        .json(
        {
            "followupEvent":{
              "name":"create_policy_holder_event",
              "data":{
                  "name" : "brandon"
              }
            }
         });
    }

    let actionMap = new Map();
    actionMap.set(GADGET_ACTION, HandleGadget);
    actionMap.set(COVER_ACTION, HandleCoverType);

    app.handleRequest(actionMap);
});

module.exports = router;
