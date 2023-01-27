import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// eslint-disable-next-line import/prefer-default-export
export const overlayAtom = atom({
  key: 'hato.overlay',
  default: {
    menu: false,
    whatsNew: false,
  },
  effects: [persistAtom],
});
