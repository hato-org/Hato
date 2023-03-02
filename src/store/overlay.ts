import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

interface Overlay {
  menu: boolean;
  whatsNew: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const overlayAtom = atom<Overlay>({
  key: 'hato.overlay',
  default: {
    menu: false,
    whatsNew: false,
  },
  effects: [persistAtom],
});
