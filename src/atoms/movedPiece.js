import { atom } from 'recoil';

const movedPieceAtom = atom({
  key: 'movedPiece',
  default: null,
});

export default movedPieceAtom;
