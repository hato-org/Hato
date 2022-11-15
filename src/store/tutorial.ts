import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

interface TutorialAtom {
  events: boolean;
  ATHS: boolean;
  iCal: boolean;
}

const { persistAtom } = recoilPersist();

// eslint-disable-next-line import/prefer-default-export
export const tutorialAtom = atom<TutorialAtom>({
  key: 'hato.tutorial',
  default: {
    events: false,
    ATHS: false,
    iCal: false,
  },
  effects: [persistAtom],
});
