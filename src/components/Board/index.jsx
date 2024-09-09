import { Box } from '@mui/material';
import BoardTile from '../BoardTile';
import boardAtom from '../../atoms/board';
import useTurns from '../../hooks/useTurns';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useRecoilValue, useRecoilState } from 'recoil';
import selectedTileAtom from '../../atoms/selectedTile';
import selectedPieceAtom from '../../atoms/selectedPiece';
import useMovingPieces from '../../hooks/useMovingPieces';

const Board = () => {
  const notify = (message) => toast(message);
  const [showCaptureAnimation, setShowCaptureAnimation] = useState(false);
  const { movingPiecesEngine } = useMovingPieces(
    notify,
    setShowCaptureAnimation
  );
  const { currentPlayer, timeLeft, switchTurn } = useTurns();
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
  console.log('ANIMATION', captureAnimation);
  return (
    <>
      <div>
        <h1>Jogador atual: {currentPlayer?.name}</h1>
        <h2>Tempo restante: {timeLeft}s</h2>
        <button onClick={switchTurn}>Passar o turno</button>
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
          <img
            src={captureAnimation}
            alt="Descrição do GIF"
            width="800"
            height="800"
          />
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
    </>
  );
};

export default Board;
