import { atomWithStorage } from 'jotai/utils';

export const settingsAtom = atomWithStorage<Settings | null>(
  'hato.settings',
  null,
);
