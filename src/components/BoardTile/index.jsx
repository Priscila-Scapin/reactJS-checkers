import { Box } from '@mui/material';

const BoardTile = ({ bgColor, id, piece, rowIndex }) => {
  console.log('BG', rowIndex);
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          display: 'flex',
          bgcolor: bgColor,
          '&:hover': {
            bgcolor: '#414141',
          },
        }}
      />
    </>
  );
};

export default BoardTile;
