const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("server started on port 3000");
});

// Begin websocket
const WebSocketServer = require("ws").Server;

// attach websocket server to an existing express server
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numOfClients = wss.clients.size;
  console.log("Clients connected", numOfClients);

  wss.broadcast(`current visitors ${numOfClients}`);

  //   there is three status which is readyState close and error
  if (ws.readyState == ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", function close() {
    wss.broadcast(`current visitors ${numOfClients}`);
    console.log("A Client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
