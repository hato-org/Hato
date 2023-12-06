import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface TutorialAtom {
  events: boolean;
  ATHS: boolean;
  iCal: boolean;
  pin: boolean;
}

export const tutorialAtom = atomWithStorage<TutorialAtom>('hato.tutorial', {
  events: false,
  ATHS: false,
  iCal: false,
  pin: false,
});

export const tutorialModalAtom = atom<TutorialAtom>({
  events: false,
  ATHS: false,
  iCal: false,
  pin: false,
});
