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
const SocketServer = require('ws').Server;
const WebSocket = require('ws');
const express = require('express');
const webhook = require('./webhook');
const restServiceSales = require('./restServiceSales');
const bodyParser = require('body-parser');

var port = process.env.PORT || 5000;
var app = express();

app.use(bodyParser.json());
//10.Webhook용 서비스 생성
app.use('/webhook', webhook);
app.use('/salesData', restServiceSales);
//20.index.html호출용 서비스 생성
app.use(express.static('static'))
var server = app.listen(port, function () {
    console.log('node.js static, REST server and websockets listening on port: ' + port)
})
//{ headers: {
//"Access-Control-Allow-Origin": "*",
//    "Access-Control-Allow-Headers": "http://localhost:3000",
//    "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS"
//} }
const wss = new SocketServer({  server });
//전체 clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

//10.Websocket용 서비스 생성
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
      // Broadcast to everyone else.
       wss.clients.forEach(function each(client) {
         if (client !== ws && client.readyState === WebSocket.OPEN) {
           client.send(data);
         }
       });
    });
    ws.send('Connection established!!');
});
