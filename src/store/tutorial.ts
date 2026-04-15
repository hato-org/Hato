import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createVersionedStorage } from '@/utils/versionedStorage';

interface TutorialAtom {
  events: boolean;
  ATHS: boolean;
  iCal: boolean;
  pin: boolean;
}

const tutorialStorage = createVersionedStorage<TutorialAtom>({
  version: 1,
  migrate: (old) => ({
    events: false,
    ATHS: false,
    iCal: false,
    pin: false,
    ...(old && typeof old === 'object' ? old : {}),
  }),
});

export const tutorialAtom = atomWithStorage<TutorialAtom>(
  'hato.tutorial',
  {
    events: false,
    ATHS: false,
    iCal: false,
    pin: false,
  },
  tutorialStorage,
);

export const tutorialModalAtom = atom<TutorialAtom>({
  events: false,
  ATHS: false,
  iCal: false,
  pin: false,
});
