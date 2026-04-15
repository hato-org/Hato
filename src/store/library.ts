import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createVersionedStorage } from '@/utils/versionedStorage';

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

const bookmarkStorage = createVersionedStorage<string[]>({
  version: 1,
  migrate: (old) => (Array.isArray(old) ? (old as string[]) : []),
});

export const libraryBookmarkAtom = atomWithStorage<string[]>(
  'hato.library.bookmarks',
  [],
  bookmarkStorage,
);
