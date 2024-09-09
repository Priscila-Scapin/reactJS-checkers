import { atom } from 'recoil';

const winnerAtom = atom({
  key: 'winner',
  default: {
    piece: '',
    name: '',
  },
});

export default winnerAtom;
