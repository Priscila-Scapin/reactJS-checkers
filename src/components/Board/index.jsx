import { Box, Button, Typography } from '@mui/material';
import BoardTile from '../BoardTile';
import boardAtom from '../../atoms/board';
import useTurns from '../../hooks/useTurns';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilValue, useRecoilState } from 'recoil';
import selectedTileAtom from '../../atoms/selectedTile';
import winnerAtom from '../../atoms/winner';
import selectedPieceAtom from '../../atoms/selectedPiece';
import useMovingPieces from '../../hooks/useMovingPieces';
import ConfettiExplosion from 'react-confetti-explosion';

const Board = () => {
  const [endOfGame, setEndOfGame] = useState(false);
  const [showCaptureAnimation, setShowCaptureAnimation] = useState(false);

  const notify = (message) => toast(message);
  const { movingPiecesEngine } = useMovingPieces(
    notify,
    setShowCaptureAnimation
  );
  const { currentPlayer, timeLeft, switchTurn } = useTurns();

  const winner = useRecoilValue(winnerAtom);
  const [boardState, setBoardState] = useRecoilState(boardAtom);
  const selectedTile = useRecoilValue(selectedTileAtom);
  const selectedPiece = useRecoilValue(selectedPieceAtom);
  const captureAnimation = './captureAnimation.gif';

  const handleMovePiece = (selectedPiece, selectedTile) => {
    movingPiecesEngine(selectedPiece, selectedTile, setShowCaptureAnimation);
  };

  useEffect(() => {
    if (selectedPiece?.colIndex !== '' && selectedTile?.colIndex !== '') {
      handleMovePiece(selectedPiece, selectedTile);
    }
  }, [selectedPiece, selectedTile]);

  useEffect(() => {
    if (winner?.name !== '') {
      setEndOfGame(true);
    }
  }, [winner]);
  const startNewGame = () => {
    window.location.reload();
  };

  return (
    <>
      <div>
        <h1>Turn: {currentPlayer?.name}</h1>
        <h2>Time remaining: {timeLeft}s</h2>
        <Button color="white" variant="outlined" onClick={switchTurn}>
          End turn
        </Button>
      </div>
      <Box
        sx={{
          gap: 0,
          margin: 4,
          width: '35vw',
          height: '35vw',
          display: 'grid',
          border: '1px solid #000',
          gridTemplateRows: 'repeat(8, 1fr)',
          gridTemplateColumns: 'repeat(8, 1fr)',
        }}
      >
        {boardState.flat().map((cell, index) => {
          const rowIndex = Math.floor(index / 8);
          const colIndex = index % 8;
          const isLight = (rowIndex + colIndex) % 2 === 0;

          return (
            <BoardTile
              pieceColor={cell}
              isLight={isLight}
              rowIndex={rowIndex}
              colIndex={colIndex}
              position={{
                rowIndex: rowIndex,
                colIndex: colIndex,
              }}
              bgColor={isLight ? '#FFFBFF' : '#1E1E1E'}
            />
          );
        })}
      </Box>
      {showCaptureAnimation && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20rem',
            height: '20rem',
          }}
        >
          <img src={captureAnimation} alt="" width="800" height="800" />
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="light"
      />
      {endOfGame && (
        <Box
          sx={{
            top: 0,
            left: 0,
            zIndex: 1000,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            position: 'fixed',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Box
            sx={{
              padding: 4,
              width: '80%',
              display: 'flex',
              maxWidth: '600px',
              borderRadius: '16px',
              position: 'relative',
              textAlign: 'center',
              alignItems: 'center',
              backgroundColor: '#404040',
              justifyContent: 'center',
              flexDirection: 'column',
              border: '3px solid white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ConfettiExplosion
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
              }}
            />
            <Typography
              variant="h1"
              component="h2"
              sx={{
                zIndex: 1,
                color: 'white',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              }}
            >
              {`${winner?.name} wins!!`}
              <Button color="white" variant="outlined" onClick={startNewGame}>
                Start new game
              </Button>
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Board;
