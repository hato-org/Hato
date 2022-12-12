import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

interface TutorialAtom {
  events: boolean;
  ATHS: boolean;
  iCal: boolean;
  pin: boolean;
}

const { persistAtom } = recoilPersist();

export const tutorialAtom = atom<TutorialAtom>({
  key: 'hato.tutorial',
  default: {
    events: false,
    ATHS: false,
    iCal: false,
    pin: false,
  },
  effects: [persistAtom],
});

export const tutorialModalAtom = atom<TutorialAtom>({
  key: 'hato.tutorial.modal',
  default: {
    events: false,
    ATHS: false,
    iCal: false,
    pin: false,
  },
});
