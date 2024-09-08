import { Box } from '@mui/material';
import { useRecoilState } from 'recoil';
import selectedTileAtom from '../../atoms/selectedTile';
import selectedPieceAtom from '../../atoms/selectedPiece';

const Piece = ({ pieceColor, position }) => {
  const [selectedPiece, setSelectedPiece] = useRecoilState(selectedPieceAtom);
  const [selectedTile, setSelectedTile] = useRecoilState(selectedTileAtom);

  return (
    <Box
      sx={{ display: 'flex', zIndex: 1 }}
      onClick={() => {
        setSelectedPiece({ ...position, pieceColor: pieceColor });
      }}
    >
      {pieceColor === 'w' && (
        <img
          src={'./dinosaur-svgrepo-com.svg'}
          alt="White Piece"
          style={{ width: '100%', height: '100%' }}
        />
      )}
      {pieceColor === 'b' && (
        <img
          src={'./rabbit-svgrepo-com.svg'}
          alt="White Piece"
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </Box>
  );
};

export default Piece;
