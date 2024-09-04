const WebSocket = require('ws');
const onConnection = require('./handlers/onConnection');

const wsServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    onConnection(ws, req, wss);
  });

  return wss;
};

module.exports = wsServer;
