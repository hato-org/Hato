import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const librarySearchAtom = atom<LibrarySearchParams>({
  key: 'hato.library.search',
  default: {
    free: '',
    title: '',
    author: '',
    publisher: '',
    ndc: '',
    year_start: '',
    year_end: '',
    isbn: '',
  },
});

export const libraryBookmarkAtom = atom<string[]>({
  key: 'hato.library.bookmarks',
  default: [],
  effects: [persistAtom],
});
