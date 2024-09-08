import { Box } from '@mui/material';
import Piece from '../Piece';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import selectedPieceAtom from '../../atoms/selectedPiece';
import selectedTileAtom from '../../atoms/selectedTile';

const BoardTile = ({ isLight, bgColor, id, pieceColor, position }) => {
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileAtom);
  const selectedPiece = useRecoilValue(selectedPieceAtom);

  return (
    <>
      <Box
        onClick={() => {
          setSelectedTile({ ...position, content: pieceColor });
        }}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          bgcolor: bgColor,
          '&:hover': {
            bgcolor: '#414141',
          },
          position: 'relative',
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <Piece pieceColor={pieceColor} position={position} />
        </Box>
      </Box>
    </>
  );
};

export default BoardTile;
