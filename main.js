var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');

var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('cedar-18/listening on %d', port);

var ws = new WebSocketServer({server: server});

var clientId = 0;
var clients = {};
ws.on('connection', function (client) {
  client._ = {};
  client._.id = clientId++;
  clients[client._.id] = client;
  console.log('connection: client ID = ' + client._.id);
  console.log('total clients: ' + Object.keys(clients).length);

  client.on('close', function () {
    console.log('close: client ID = ' + this._.id);
    delete clients[this._.id];
    console.log('total clients: ' + Object.keys(clients).length);
  }.bind(client));

  client.on('message', function (data, flags) {
    console.log('message: client ID = ' + this._.id);
    console.log('data: ' + data);
    console.log('total clients: ' + Object.keys(clients).length);
    for (var id in clients) {
      console.log('broadcast to client ID = ' + id);
      clients[id].send(data);
    }
  }.bind(client));
})
