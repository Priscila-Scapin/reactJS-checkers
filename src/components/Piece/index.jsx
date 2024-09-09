import { Box } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import selectedTileAtom from '../../atoms/selectedTile';
import selectedPieceAtom from '../../atoms/selectedPiece';

const Piece = React.memo(
  ({ pieceColor, position }) => {
    const [selectedPiece, setSelectedPiece] = useRecoilState(selectedPieceAtom);

    return (
      <Box
        sx={{ display: 'flex', zIndex: 1 }}
        onClick={() => {
          setSelectedPiece({ ...position, pieceColor: pieceColor });
        }}
      >
        {pieceColor === 'w' && (
          <img
            src={'./dama_vermelha.png'}
            alt="Red Piece"
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {pieceColor === 'wKing' && (
          <img
            src={'./dama_vermelha_queen.png'}
            alt="Red King Piece"
            style={{ width: '100%', height: '100%' }}
          />
        )}
        {pieceColor === 'b' && (
          <img
            src={'./dama_preta.png'}
            alt="Black Piece"
            style={{ width: '100%', height: '100%' }}
          />
        )}
        {pieceColor === 'bKing' && (
          <img
            src={'./dama_preta_queen.png'}
            alt="Black King Piece"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.pieceColor === nextProps.pieceColor &&
      prevProps.position.rowIndex === nextProps.position.rowIndex &&
      prevProps.position.colIndex === nextProps.position.colIndex
    );
  }
);

export default Piece;
