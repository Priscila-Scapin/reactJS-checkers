import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import playerAtom from '../atoms/player';
import movedPieceAtom from '../atoms/movedPiece';

const useTurns = (initialPlayer = { piece: 'w', name: 'Player 1' }) => {
  const [currentPlayer, setCurrentPlayer] = useRecoilState(playerAtom);
  const [_movedPiece, setMovedPiece] = useRecoilState(movedPieceAtom);
  const [timeLeft, setTimeLeft] = useState(5);

  const switchTurn = () => {
    if (currentPlayer?.name === 'Player 1') {
      setCurrentPlayer({ piece: 'b', name: 'Player 2' });
    } else {
      setCurrentPlayer({ piece: 'w', name: 'Player 1' });
    }
    setMovedPiece(null);
    resetTimer();
  };

  const resetTurn = () => {
    setCurrentPlayer(initialPlayer);
    resetTimer();
  };

  const resetTimer = () => {
    setTimeLeft(5);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      switchTurn();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return {
    currentPlayer,
    timeLeft,
    switchTurn,
    resetTurn,
  };
};

export default useTurns;
