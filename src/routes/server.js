const express = require('express');
const http = require('http');
const wsServer = require('../../backend/webSockets/webSocketServer.js');

const app = express();
const server = http.createServer(app);

// Inicializa o WebSocket Server
wsServer(server);

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
