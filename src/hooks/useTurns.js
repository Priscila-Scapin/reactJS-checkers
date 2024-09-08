import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import playerAtom from '../atoms/player';
import movedPieceAtom from '../atoms/movedPiece';

const useTurns = (initialPlayer = 'w') => {
  const [currentPlayer, setCurrentPlayer] = useRecoilState(playerAtom);
  const [movedPiece, setMovedPiece] = useRecoilState(movedPieceAtom);
  const [timeLeft, setTimeLeft] = useState(10);

  const switchTurn = () => {
    setCurrentPlayer(currentPlayer === 'w' ? 'b' : 'w');
    setMovedPiece(null);
    resetTimer();
  };

  const resetTurn = () => {
    setCurrentPlayer(initialPlayer);
    resetTimer();
  };

  const resetTimer = () => {
    setTimeLeft(10);
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
