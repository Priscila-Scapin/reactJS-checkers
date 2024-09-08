import { atom } from 'recoil';

const selectedPieceAtom = atom({
  key: 'selectedPiece',
  default: {
    rowIndex: '',
    colIndex: '',
    pieceColor: '',
  },
});

export default selectedPieceAtom;
