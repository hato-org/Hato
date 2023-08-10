import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// eslint-disable-next-line import/prefer-default-export
export const settingsAtom = atom<Settings | null>({
  key: 'hato.settings',
  default: null,
  effects: [persistAtom],
});
