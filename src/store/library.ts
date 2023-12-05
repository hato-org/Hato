import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const librarySearchAtom = atom<LibrarySearchParams>({
  free: '',
  title: '',
  author: '',
  publisher: '',
  ndc: '',
  year_start: '',
  year_end: '',
  isbn: '',
});

export const libraryBookmarkAtom = atomWithStorage<string[]>(
  'hato.library.bookmarks',
  [],
);
