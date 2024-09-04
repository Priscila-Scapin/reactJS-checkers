const gameLogic = require('./gameLogic');
const broadcast = require('../utils/broadcast');

const onMessage = (ws, message, wss) => {
  console.log(`Received: ${message}`);

  const data = JSON.parse(message);

  // Lógica do jogo: Processa o movimento enviado
  const result = gameLogic.processMove(data);

  if (result.valid) {
    // Se a jogada é válida, transmite o novo estado do jogo para todos os jogadores
    broadcast(wss, { type: 'move', gameState: result.gameState });
  } else {
    // Opcional: enviar uma mensagem de erro para o jogador
    ws.send(JSON.stringify({ type: 'error', message: 'Invalid move' }));
  }
};

module.exports = onMessage;
