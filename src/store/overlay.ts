import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

interface Overlay {
  menu: boolean;
  cardOrder: boolean;
  whatsNew: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const overlayAtom = atom<Overlay>({
  key: 'hato.overlay',
  default: {
    menu: false,
    cardOrder: false,
    whatsNew: false,
  },
  effects: [persistAtom],
});
