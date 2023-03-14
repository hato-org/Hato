import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const jwtAtom = atom<string | null>({
  key: 'hato.auth',
  default: null,
  effects: [persistAtom],
});

export const userAtom = atom<User | null>({
  key: 'hato.user',
  default: null,
  effects: [persistAtom],
});
