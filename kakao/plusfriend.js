'use strict';
var apiai = require("apiai");
const express = require('express');
var router = express.Router();

//10. dialogflow의 프로젝트에 있는 client용 키
var chatapp = apiai("a26c7c45ff4b41109fe17cb0d6628954", {
    language: 'ko-KR'
});
var oResponse = {
  "message":{
    "text":""
  }
}
var options = {
    sessionId: 'kakaotalk'
};
router.get('/keyboard',function(request,response){
  const menu = {
     type: "text",
	 content:"Hello world"
 };
 response.json(menu);
});
//request.body.content
router.post('/message',function(request,response){
  let sUser_key = decodeURIComponent(request.body.user_key); // user's key
  let sType = decodeURIComponent(request.body.type); // message type
  let sContent = decodeURIComponent(request.body.content); // user's message
  //user key 전달
  options.user_key = sUser_key;
  console.log(options);
  var request = chatapp.textRequest(sContent, options);
  //test
  // oResponse.message.text=sContent;

    request.on('response', function(res) {
     // console.log(res);
     oResponse.message.text=res.result.fulfillment.speech;
     response.json(oResponse);
    // response.json(res);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
});

module.exports = router;
