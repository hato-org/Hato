import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

interface Overlay {
  menu: boolean;
  cardOrder: boolean;
  whatsNew: boolean;
  userScheduleEditor: string | false;
  userSubjectEditor: string | false;
  divisionEditor: Date | false;
}

// eslint-disable-next-line import/prefer-default-export
export const overlayAtom = atom<Overlay>({
  key: 'hato.overlay',
  default: {
    menu: false,
    cardOrder: false,
    whatsNew: false,
    userScheduleEditor: false,
    userSubjectEditor: false,
    divisionEditor: false,
  },
  effects: [persistAtom],
});
