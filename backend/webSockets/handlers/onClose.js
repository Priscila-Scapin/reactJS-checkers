const onClose = (ws, wss) => {
  console.log('Player disconnected');

  // Opcional: Lógica para remover o jogador do jogo ou notificar os outros jogadores
};

module.exports = onClose;
