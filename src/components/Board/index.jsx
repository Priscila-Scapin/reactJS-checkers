import { Box } from '@mui/material';
import BoardTile from '../BoardTile';
import DefaultModal from '../modals';
import { useRecoilValue, useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import boardAtom from '../../atoms/board';
import selectedTileAtom from '../../atoms/selectedTile';
import selectedPieceAtom from '../../atoms/selectedPiece';
import useMovingPieces from '../../hooks/useMovingPieces';
import movingPiecesRulesValidations from '../../handlers/movingPiecesRulesValidations';
import useTurns from '../../hooks/useTurns';

const Board = () => {
  const {
    turnedIntoKing,
    isMovementDiagonal,
    isDestinyTileEmpty,
    isFromSameTeamPiece,
    checkAdjacentValuesForOpponentPieces,
    checkAdjacentTilesEmptiness,
  } = movingPiecesRulesValidations;

  const { movingPiecesEngine } = useMovingPieces();
  const { currentPlayer, timeLeft, switchTurn } = useTurns();
  const [boardState, setBoardState] = useRecoilState(boardAtom);
  const selectedTile = useRecoilValue(selectedTileAtom);
  const selectedPiece = useRecoilValue(selectedPieceAtom);

  // const [openDialog, setOpenDialog] = useState(false);

  // const handleOpenModal = () => {
  //   setOpenDialog(true);
  // };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  const handleMovePiece = (selectedPiece, selectedTile) => {
    movingPiecesEngine(selectedPiece, selectedTile);
  };

  useEffect(() => {
    if (selectedPiece?.colIndex !== '' && selectedTile?.colIndex !== '') {
      handleMovePiece(selectedPiece, selectedTile);
      // movingPiecesEngine(boardState, selectedPiece, selectedTile);
    }
  }, [selectedPiece, selectedTile]);

  return (
    <>
      <div>
        <h1>Jogador atual: {currentPlayer}</h1>
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
        {/* <DefaultModal open={openDialog} handleClose={handleCloseDialog} /> */}
      </Box>
    </>
  );
};

export default Board;
