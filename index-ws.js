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

// to listen to server process kill and close connections
process.on("SIGINT", () => {
  wss.clients.forEach(function each(client) {
    client.close();
  });
  server.close(() => {
    shutdownDB();
  });
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

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numOfClients}, datetime('now'))`);

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

// Database

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
      CREATE TABLE visitors (
        count INTEGER,
        time TEXT
      )
    `);
});

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
}

function shutdownDB() {
  getCounts();

  console.log("shuting down");
  db.close();
}
