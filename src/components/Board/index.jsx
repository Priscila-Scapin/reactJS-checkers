import { Box } from '@mui/material';
import BoardTile from '../BoardTile';
import { useState } from 'react';

const initialBoardState = [
  [null, 'w', null, 'w', null, 'w', null, 'w'],
  ['w', null, 'w', null, 'w', null, 'w', null],
  [null, 'w', null, 'w', null, 'w', null, 'w'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['b', null, 'b', null, 'b', null, 'b', null],
  [null, 'b', null, 'b', null, 'b', null, 'b'],
  ['b', null, 'b', null, 'b', null, 'b', null],
];

const Board = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleMove = (from, to) => {
    const updatedBoardPiecesPositions = [...boardState];
    // lógica para mover a peça, verificar captura, etc.
    setBoardState(updatedBoardPiecesPositions);
  };
  return (
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
      {initialBoardState.flat().map((cell, index) => {
        const rowIndex = Math.floor(index / 8);
        const colIndex = index % 8;
        const isLight = (rowIndex + colIndex) % 2 === 0;

        return (
          <BoardTile
            piece={cell}
            rowIndex={rowIndex}
            id={`${rowIndex}-${colIndex}`}
            bgColor={isLight ? '#FFFBFF' : '#1E1E1E'}
          />
        );
      })}
    </Box>
  );
};

export default Board;
