import { atom } from 'recoil';

const playerAtom = atom({
  key: 'player',
  default: {
    piece: 'w',
    name: 'Player 1',
  },
});

export default playerAtom;
