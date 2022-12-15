import { atom, selector } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const librarySearchAtom = atom<LibrarySearchParams>({
  key: 'hato.library.search',
  default: {
    free: undefined,
    title: undefined,
    author: undefined,
    publisher: undefined,
    ndc: undefined,
    yearStart: undefined,
    yearEnd: undefined,
    isbn: undefined,
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
