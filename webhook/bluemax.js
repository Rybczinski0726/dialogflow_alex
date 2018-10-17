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
const salesByCountry = require('../data/SalesByCountry.json');
const salesByDivision = require('../data/SalesByDivision.json');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
//init Express Router
var webhook = express.Router();
// var url = "wss://s0003918939trial-trial-dev-ui5websocket.cfapps.eu10.hana.ondemand.com";
var url = "wss://dialogflowalex.cfapps.ap10.hana.ondemand.com/";
// var wsClient = new WebSocket(url);

webhook.post('/',function(request, response) {
  const agent = new WebhookClient({ request, response });

//WebSocket호출
var ws = new WebSocket(url);
ws.onopen = function () {
       // console.log('websocket is connected ...')
        // sendResponseToWebsocket(responseJson);
        // ws.send(JSON.stringify(response.fulfillmentMessages));
        // console.log(request.body);
        ws.send(JSON.stringify(request.body));
        ws.close();
   }
/**
* INTENT별 기능 정의
*/
//10.Viewpoint별 매출(국가, 부문, 제품) Q: 국가별 8월 기준 매출 현황 보여줘
function SalesByViewpoint(agent){
  //10.10 파라미터
  let sViewpoint = agent.parameters.Viewpoint;
  let sPeriod  = agent.parameters.Period.startDate;
  let sDate = sPeriod.split('T')[0].split('-')[0]+sPeriod.split('T')[0].split('-')[1]+sPeriod.split('T')[0].split('-')[2];
  let sResponse = sViewpoint+ ` 기준 ` + sDate.substr(0,4)+`년 `+sDate.substr(4,2)+`월의 매출 상위는 `;
  let aFilteredData = [];
  let aTopResult = [];
  let sTopResult = '';

  //10.20 sViewPoint는 국가,부문,제품으로 나뉘므로 분기처리
  switch (sViewpoint) {
    case '국가':
         //날짜로 필터
         aFilteredData = salesByCountry.filter(responseSales => responseSales.Date === sDate);
         //상위 n개를 내림차순으로 리턴
         aTopResult = TopNArrays(aFilteredData,true,'Sales',3);
         sTopResult = ArrayToStringProp(aTopResult,'Country',',');//데이터, 컬럼, 분리자
         // console.log(sTopResult);
         sResponse += sTopResult + '입니다.';
         agent.add(sResponse);
      break;
    case '부문':
        //날짜로 필터
        aFilteredData = salesByDivision.filter(responseSales => responseSales.Date === sDate);
        //상위 n개를 내림차순으로 리턴
        aTopResult = TopNArrays(aFilteredData,true,'Sales',3);
        sTopResult = ArrayToStringProp(aTopResult,'Division',',');//데이터, 컬럼, 분리자
        // console.log(sTopResult);
        sResponse += sTopResult + '입니다.';
        agent.add(sResponse);
        break;

    case '제품':

          break;
    default:

  }
  // agent.add(sCountry+`의 `+sPeriod.startDateTime.split('-')[0]+`년 `+sPeriod.startDateTime.split('-')[1]+`월 기준 매출은 100만원입니다.`)
  // agent.add(new Suggestion('저번달은 어때?'));
}
//10.100 Sales By Viewpoint - Compare Q:저번 달이랑 비교해서 보여줘
function SalesByViewpointCompare(agent){
  let sViewpoint = agent.parameters.Viewpoint;
  let sPeriodFrom  = agent.parameters.PeriodFrom.startDate;
  let sPeriodTo  = agent.parameters.PeriodTo.startDate;
  let sDateFrom = sPeriodFrom.split('T')[0].split('-')[0]+sPeriodFrom.split('T')[0].split('-')[1]+sPeriodFrom.split('T')[0].split('-')[2];
  let sDateTo = sPeriodTo.split('T')[0].split('-')[0]+sPeriodTo.split('T')[0].split('-')[1]+sPeriodTo.split('T')[0].split('-')[2];

  // let sResponse = sViewpoint+ ` 기준 ` + sDate.substr(0,4)+`년 `+sDate.substr(4,2)+`월의 매출 상위는 `;
  let aFilteredData = [];
  let aTopResult = [];
  let sTopResult = '';
  agent.add(sDateFrom+'대비 '+sDateTo+'의 데이터');
}
//10.110 Sales By Viewpoint - AddProfit Q:영업 이익은 어때?
function SalesByViewpointAddProfit(agent){
  let sViewpoint = agent.parameters.Viewpoint;
  let sFinancialKPI = agent.parameters.FinancialKPI;
  let sPeriod  = agent.parameters.Period.startDate;
  let sDate = sPeriod.split('T')[0].split('-')[0]+sPeriod.split('T')[0].split('-')[1]+sPeriod.split('T')[0].split('-')[2];


  agent.add(sFinancialKPI+'을 추가했습니다.');
}
function SalesByViewpointChangeViewpoint(agent){
  // let sViewpoint = agent.parameters.Viewpoint;
  // let sFinancialKPI = agent.parameters.FinancialKPI;
  // let sPeriod  = agent.parameters.Period.startDate;
  // let sDate = sPeriod.split('T')[0].split('-')[0]+sPeriod.split('T')[0].split('-')[1]+sPeriod.split('T')[0].split('-')[2];
  //
  //
  // agent.add(sFinancialKPI+'을 추가했습니다.');
    SalesByViewpoint(agent);
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
  let sEmployeeInformation =  agent.parameters.EmployeeInformation;
  agent.add('요청하신 '+sEmployeeInformation+' 정보를 화면으로 전송하였습니다.');
}
//40.   Query Local Area Q:아 그리고 오늘 회의 끝나고 수원에서 회식할 건데 예전에 갔을 때 별로 던데 최근에 괜찮은 식당 같은게 생겼나?
function QueryLocalArea(agent){
  // let conv = agent.conv();
  let sAreaItem =  agent.parameters.AreaItem;
  // conv.ask(`요청하신 `+sAreaItem+` 정보를 화면으로 전송하였습니다.`)
  // conv.ask(`가장 평이 좋은 '한우리'로 예약을 진행할까요?`);
  // agent.add(`요청하신 `+sAreaItem+` 정보를 화면으로 전송하였습니다.`);

  // agent.add(conv);
  agent.add(`가장 평이 좋은 '한우리'로 예약을 진행할까요?`);

}
//50.    Call RPA Q:참 이번에 A社랑 계약금이 입금됐는지 확인해줘
function CallRPA (agent){
  agent.add('연계된 RPA서버를 통해서 조회중입니다.');

}
//60. Help Q:현재 화면에 대해 설명해줘
function Help(agent){

}
//70. Summarize finance
function  Summarizefinance(agent){
  agent.add(`이번 달은 계획 대비 매출은 5% 초과달성이 예상되며, 영업 이익은 약 9% 정도 초과달성 할 것으로 보입니다. 다만, 미국과 중국의 무역 전쟁의 영향으로 북미에서의 매출 증가율이 타 국가에 비해 저조할 것으로 보입니다. `);

}
//80. Sales By Country   Q:미국의 올해 매출 현황 알려줘
function SalesByCountry(agent){
  let sCountry = agent.parameters.Country;
  let sYearRaw  = agent.parameters.Year.startDate;
  let sYear = sYearRaw.substr(0,4);
  // console.log(sCountry);
  // console.log(sYear);
  agent.add(sCountry+'의 '+sYear+'년도 매출 현황입니다.');
}
//80.10 Sales By Country - AddProfit Q:영업 이익은 어때?
function SalesByCountryAddProfit(agent){
  // let sCountry = agent.parameters.Country;
  // let sYearRaw  = agent.parameters.Year.startDate;
  // let sYear = sYearRaw.substr(0,4);
  let sFinancialKPI = agent.parameters.FinancialKPI;
  // console.log(sCountry);
  // console.log(sYear);
  agent.add(sFinancialKPI+'을 추가했습니다.');
}
//90. Sales By Division   Q:미국의 올해 매출 현황 알려줘
function SalesByDivision(agent){
  let sDivision = agent.parameters.Division;
  let sYearRaw  = agent.parameters.Year.startDate;
  let sYear = sYearRaw.substr(0,4);
  agent.add(sDivision+'의 '+sYear+'년도 매출 현황입니다.');
}
//90.10 Sales By Division - AddProfit Q:영업 이익은 어때?
function SalesByDivisionAddProfit(agent){
  // let sDivision = agent.parameters.Division;
  // let sYearRaw  = agent.parameters.Year.startDate;
  // let sYear = sYearRaw.substr(0,4);
  let sFinancialKPI = agent.parameters.FinancialKPI;
  agent.add(sFinancialKPI+'을 추가했습니다.');
}

//100.SmallTalk-ExchangeRate Q:오늘 기준 100달러가 원화로 얼마야?
function SmallTalkExchangeRate(agent){
  let sDate = agent.parameters.Date;
  let sUnitCurrencyFrom = agent.parameters.UnitCurrencyFrom;
  let iAmount = sUnitCurrencyFrom.amount;
  let sCurrencyTo = agent.parameters.CurrencyTo;
  agent.add('금일 외환은행 고시 환율 기준으로 '+iAmount*1000+'원입니다')
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
    agent.add(`안녕하세요. 블루맥스입니다.`);
  }

  function fallback(agent) {
    // agent.add(`죄송합니다. 무슨 말씀인지 잘 모르겠습니다.`);
    googleAssistantOther(agent);
  }


  // Run the proper handler based on the matched Dialogflow intent
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Sales By Viewpoint', SalesByViewpoint);
  intentMap.set('Query Product', QueryProduct);
  intentMap.set('Sales By Viewpoint', SalesByViewpoint);
  intentMap.set('Sales By Viewpoint - ChangeDate', SalesByViewpoint);
  intentMap.set('Sales By Viewpoint - Compare', SalesByViewpointCompare);
  intentMap.set('Sales By Viewpoint - AddProfit', SalesByViewpointAddProfit);
  intentMap.set('Sales By Viewpoint - ChangeViewpoint', SalesByViewpointChangeViewpoint);
  // intentMap.set('Sales By Viewpoint - AddDivision', SalesByViewpointAddDivision);
  // intentMap.set('Sales By Viewpoint - AddDivision - Drilldown', SalesByViewpointAddDivisionDrilldown);
  // intentMap.set('Sales By Viewpoint - smallTalk-ExchangeRate', SalesByViewpointsmallTalkExchangeRate);
  // intentMap.set('Sales By Viewpoint - SendEmail', SalesByViewpointSendEmail);
  // intentMap.set('Sales By Viewpoint - ChangePeriod', SalesByViewpointChangePeriod);
  // intentMap.set('Sales By Viewpoint - Profit', SalesByViewpointProfit);
  intentMap.set('Query Employee', QueryEmployee);
  intentMap.set('Query Local Area', QueryLocalArea);
  intentMap.set('Call RPA', CallRPA);
  intentMap.set('Call RPA - yes', CallRPAyes);
  intentMap.set('Call RPA - no', CallRPAno);
  intentMap.set('Help', Help);
  intentMap.set('Summarize finance', Summarizefinance);
  intentMap.set('Sales By Country', SalesByCountry);
  intentMap.set('Sales By Division', SalesByDivision);//Sales By Viewpoint - ChangeDate
  intentMap.set('Sales By Country - AddProfit',SalesByCountryAddProfit);
  intentMap.set('Sales By Division - AddProfit',SalesByDivisionAddProfit);
  intentMap.set('SmallTalk-ExchangeRate',SmallTalkExchangeRate);


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

///common Functions
function TopNArrays(aData,bDesc,sSortProp,iTop){
  //aData에서 bDesc를 이용해(오름차순/내림차순)sSortProp 기준으로 정렬하여 상위 iTop개를 리턴
  //10.정렬
  if(bDesc){//내림차순일 경우
    aData.sort(function(a,b){
      return a[sSortProp]>b[sSortProp] ? -1 : a[sSortProp]<b[sSortProp]?1:0;
    });
  } else {
    aData.sort(function(a,b){
      return a[sSortProp]<b[sSortProp] ? -1 : a[sSortProp]>b[sSortProp]?1:0;
    });
  }
  //20. 상위 iTop개 리턴
  return aData.slice(0,iTop);
};

function ArrayToStringProp(aData,sProp,sSep){
  let sResult = '';
  // return aData[sProp].toString();
  for(var i=0;i<aData.length;i++){
    sResult += aData[i][sProp] + sSep;
  }
  //마지막 ,는 지워

  return sResult;
}

module.exports = webhook;
