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
// var url = "wss://s0003918939trial-trial-dev-ui5websocket.cfapps.eu10.hana.ondemand.com";
var url = "wss://dialogflowalex.herokuapp.com/";
// var wsClient = new WebSocket(url);

webhook.post('/',function(request, response) {
  const agent = new WebhookClient({ request, response });

//WebSocket호출
var ws = new WebSocket(url);
ws.onopen = function () {
       // console.log('websocket is connected ...')
        // sendResponseToWebsocket(responseJson);
        ws.send(JSON.stringify(response.fulfillmentMessages));
   }
/**
* INTENT별 기능 정의
*/
//10.Viewpoint별 매출(국가, 부문, 제품) Q: 국가별 8월 기준 매출 현황 보여줘
function SalesByViewpoint(agent){
  //10.1 파라미터
  let sViewpoint = agent.parameters.Viewpoint;
  let sPeriod  = agent.parameters.Period;
  // agent.add(sCountry+`의 `+sPeriod.startDateTime.split('-')[0]+`년 `+sPeriod.startDateTime.split('-')[1]+`월 기준 매출은 100만원입니다.`)
  // agent.add(new Suggestion('저번달은 어때?'));
}
//10.100 Sales By Viewpoint - AddDivision Q:미국 매출 실적을 부문별로 보여줘
function SalesByViewpointAddDivision(agent){

}
//10.100.10 Sales By Viewpoint - AddDivision - Drilldown Q:DP부문의 영업이익이 왜 저렇게 낮지?
function SalesByViewpointAddDivisionDrilldown(agent){

}
//10.200 Sales By Viewpoint - smallTalk-ExchangeRate Q:오늘 환율 기준으로 100달러가 원화로 얼마야?
function SalesByViewpointsmallTalkExchangeRate(agent){

}
//10.300 Sales By Viewpoint - SendEmail Q:작년 실적을 포함한 상세 정보를 내 메일로 전송해줘
function SalesByViewpointSendEmail(agent){

}
//10.400 Sales By Viewpoint - ChangePeriod Q:저번 달은 어때?
function SalesByViewpointChangePeriod(agent){

}
//10.500 Sales By Viewpoint - Profit Q:영업 이익은 어때?
function SalesByViewpointProfit(agent){

}
//20. 제품 조회 Query Product Q:리지드 OLED가 뭐야?
function QueryProduct(agent){
  let sProduct = agent.parameters.Product;
  agent.add(sProduct+`에 대한 정보입니다`);
  switch (sProduct) {
    case `리지드`:
        agent.add(new Card({
            title: `제품 상세 정보`,
            imageUrl: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB9aBdgJwyYikgxaLQwjT6BrhUvyFZUbsFl8beN4TCtril9Wcn`,
            text: `자체발광으로 최고의 화질을 구현하는 디스플레이 OLED. OLED는 뛰어난 화질과 얇은 두께, 그리고 가벼운 무게로 모바일 디스플레이의 주류로 자리잡음`,
            buttonText: '더 보기',
            buttonUrl: `http://news.samsungdisplay.com/11544`
          })
        );
        agent.add(new Suggestion(`플렉서블 OLED는 뭐야`));
        break;
        case `플렉서블 OLED`:
        agent.add(new Card({
            title: `제품 상세 정보`,
            imageUrl: `http://www.ddaily.co.kr/data/photos/cdn/20171041/art_1507683592.jpg`,
            text: `말 그대로 부드럽게 휘어지고 자유롭게 구부릴 수 있는 형태의 디스플레이를 말합니다. 디스플레이가 깨지거나 부러지지 않고 휘어질 수 있는 이유는..`,
            buttonText: '더 보기',
            buttonUrl: `https://en.wikipedia.org/wiki/Flexible_organic_light-emitting_diode`
          })
        );
        agent.add(new Suggestion(`리지드 OLED는 뭐야`));
      break;
    default:
  }
}
//30.  Query Employee Q:김과장 연락처 좀 검색해줘
function QueryEmployee(agent){

}
//40.   Query Local Area Q:아 그리고 오늘 회의 끝나고 수원에서 회식할 건데 예전에 갔을 때 별로 던데 최근에 괜찮은 식당 같은게 생겼나?
function QueryLocalArea(agent){

}
//50.    Call RPA Q:참 이번에 A社랑 계약금이 입금됐는지 확인해줘
function CallRPA (agent){

}
//50.100    Call RPA - yes Q:그래
function CallRPAyes (agent){

}
//50.100    Call RPA - no Q:아니
function CallRPAno (agent){

}
//60. Help Q:현재 화면에 대해 설명해줘
function Help(agent){

}
//70. Summarize finance
function  Summarizefinance(agent){

}

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


  // Run the proper handler based on the matched Dialogflow intent
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Sales By Viewpoint', SalesByViewpoint);
  intentMap.set('Query Product', QueryProduct);
  intentMap.set('Sales By Viewpoint', SalesByViewpoint);
  intentMap.set('Sales By Viewpoint - AddDivision', SalesByViewpointAddDivision);
  intentMap.set('Sales By Viewpoint - AddDivision - Drilldown', SalesByViewpointAddDivisionDrilldown);
  intentMap.set('Sales By Viewpoint - smallTalk-ExchangeRate', SalesByViewpointsmallTalkExchangeRate);
  intentMap.set('Sales By Viewpoint - SendEmail', SalesByViewpointSendEmail);
  intentMap.set('Sales By Viewpoint - ChangePeriod', SalesByViewpointChangePeriod);
  intentMap.set('Sales By Viewpoint - Profit', SalesByViewpointProfit);
  intentMap.set('Query Employee', QueryEmployee);
  intentMap.set('Query Local Area', QueryLocalArea);
  intentMap.set('Call RPA', CallRPA);
  intentMap.set('Call RPA - yes', CallRPAyes);
  intentMap.set('Call RPA - no', CallRPAno);
  intentMap.set('Help', Help);
  intentMap.set('Summarize finance', Summarizefinance);


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
