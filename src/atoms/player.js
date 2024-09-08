import { atom } from 'recoil';

const playerAtom = atom({
  key: 'player',
  default: 'w',
});

export default playerAtom;
