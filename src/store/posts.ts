import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// eslint-disable-next-line import/prefer-default-export
export const pinnedPostAtom = atom<string[]>({
  key: 'hato.posts.pinned',
  default: [],
  effects: [persistAtom],
});

export const postsScrollIndexAtom = atom({
  key: 'hato.posts.scroll',
  default: 0,
});
