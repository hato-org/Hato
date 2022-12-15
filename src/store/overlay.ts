import { atom } from 'recoil';

// eslint-disable-next-line import/prefer-default-export
export const overlayAtom = atom({
  key: 'hato.overlay',
  default: {
    menu: false,
  },
});
