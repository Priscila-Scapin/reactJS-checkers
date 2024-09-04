const onMessage = require('./onMessage');
const onClose = require('./onClose');

const onConnection = (ws, req, wss) => {
  console.log('New player connected');

  ws.on('message', (message) => onMessage(ws, message, wss));
  ws.on('close', () => onClose(ws, wss));
};

module.exports = onConnection;
