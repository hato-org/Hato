import { atomWithStorage } from 'jotai/utils';

export const jwtAtom = atomWithStorage<string | null>(
  'hato.auth',
  null,
  undefined,
  { getOnInit: true },
);

export const userAtom = atomWithStorage<User | null>(
  'hato.user',
  null,
  undefined,
  { getOnInit: true },
);
