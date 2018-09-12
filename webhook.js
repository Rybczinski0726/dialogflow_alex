/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

//const functions = require('firebase-functions');
const express = require('express');
// const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');
const WebSocket = require('ws');
// URLs for images used in card rich responses
const imageUrl = 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png';
const imageUrl2 = 'https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const linkUrl = 'https://assistant.google.com/';
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
//init Express Router
var webhook = express.Router();
var url = "wss://dialogflowalex.herokuapp.com/";
var wsClient = new WebSocket(url);

webhook.post('/',function(request, response) {
  const agent = new WebhookClient({ request, response });
  //999.Websocket을 통한 request호출 START

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  wsClient.send(JSON.stringify(request.queryResult));//, console.log.bind(null, 'Sent : ', JSON.stringify(responseToUser)));
//아래는 필요있을까?
 process.stdin.on('data', function(message) {
   message = message.trim();
   console.log("stdin data")
   wsClient.send(message);//, console.log.bind(null, 'Sent : ', message));
 });
  //999.Websocket을 통한 request호출 END
  // console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  // console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
//Google Assistant일 경우 Carousel로
  function googleAssistantOther(agent) {
    let conv = agent.conv(); // Get Actions on Google library conversation object
    conv.ask('Please choose an item:'); // Use Actions on Google library to add responses
    conv.ask(new Carousel({
      title: 'Google Assistant',
      items: {
        'WorksWithGoogleAssistantItemKey': {
          title: 'Works With the Google Assistant',
          description: 'If you see this logo, you know it will work with the Google Assistant.',
          image: {
            url: imageUrl,
            accessibilityText: 'Works With the Google Assistant logo',
          },
        },
        'GoogleHomeItemKey': {
          title: 'Google Home',
          description: 'Google Home is a powerful speaker and voice Assistant.',
          image: {
            url: imageUrl2,
            accessibilityText: 'Google Home'
          },
        },
      },
    }));
    // Add Actions on Google library responses to your agent's response
    agent.add(conv);
  }
  //Google Assistant가 아닐 경우 그냥 카드로.
  function other(agent) {
    agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    agent.add(new Card({
        title: `Title: this is a card title`,
        imageUrl: imageUrl,
        text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
        buttonText: 'This is a button',
        buttonUrl: linkUrl
      })
    );
    agent.add(new Suggestion(`Quick Reply`));
    agent.add(new Suggestion(`Suggestion`));
    // agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  }

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
   //10.국가별 매출 현황 Sales By Country
   function salesByCountry(agent){
     //10.1 파라미터
     let sCountry = agent.parameters.Country;
     let sPeriod  = agent.parameters.Period;
     agent.add(sCountry+`의 `+sPeriod.startDateTime.split('-')[0]+`년 `+sPeriod.startDateTime.split('-')[1]+`월 기준 매출은 100만원입니다.`)
     agent.add(new Suggestion('저번달은 어때?'));
   }




  // Run the proper handler based on the matched Dialogflow intent
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Sales By Country', salesByCountry);
  // if requests for intents other than the default welcome and default fallback
  // is from the Google Assistant use the `googleAssistantOther` function
  // otherwise use the `other` function
  if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
    intentMap.set(null, googleAssistantOther);
  } else {
    intentMap.set(null, other);
  }
  agent.handleRequest(intentMap);
});


module.exports = webhook;
