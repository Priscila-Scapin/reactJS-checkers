import { atom } from 'recoil';

const winnerAtom = atom({
  key: 'winner',
  default: '',
});

export default winnerAtom;
