import { atom, errorSelector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

interface AuthAtom {
  token: string | null;
  isLoggedIn: boolean;
}

const { persistAtom } = recoilPersist();

export const authAtom = atom<AuthAtom>({
  key: 'hato.auth',
  default: {
    token: null,
    isLoggedIn: false,
  },
  effects: [persistAtom],
});

export const userAtom = atom<User>({
  key: 'hato.user',
  default: errorSelector('Not logged in'),
  effects: [persistAtom],
});
