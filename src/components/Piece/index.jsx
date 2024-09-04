import { Box } from '@mui/material';
import { red } from '@mui/material/colors';

const Piece = ({ color }) => {
  return (
    <Box
      sx={{
        gap: 0,
        margin: 4,
        width: '5vw',
        boxShadow: 3,
        height: '5vw',
        display: 'flex',
        borderRadius: '100%',
        background: { color },
        border: '1px solid #000',
      }}
    />
  );
};

export default Piece;
