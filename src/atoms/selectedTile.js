import { atom } from 'recoil';

const selectedTileAtom = atom({
  key: 'selectedTile',
  default: {
    rowIndex: '',
    colIndex: '',
    content: '',
  },
});

export default selectedTileAtom;
