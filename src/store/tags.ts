import { atom } from 'recoil';

// eslint-disable-next-line import/prefer-default-export
export const tagsAtom = atom<Tag[]>({
  key: 'hato.tags',
  default: [],
});
