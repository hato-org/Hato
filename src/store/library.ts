import { atom, selector } from 'recoil';
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
    year_start: 0,
    year_end: 0,
    isbn: '',
    region: 'gk-2004103-auf08',
  },
});

export const librarySearchParamsSelector = selector<LibrarySearchParams>({
  key: 'hato.library.search.params',
  get: ({ get }) => ({
    ...Object.fromEntries(
      Object.entries(get(librarySearchAtom)).filter(([, v]) => !!v)
    ),
    region: 'gk-2004103-auf08',
  }),
});

export const libraryBookmarkAtom = atom<string[]>({
  key: 'hato.library.bookmarks',
  default: [],
  effects: [persistAtom],
});
