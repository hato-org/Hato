import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { StateSnapshot } from 'react-virtuoso';

export const pinnedPostAtom = atomWithStorage<string[]>(
  'hato.posts.pinned',
  [],
);

export const postsScrollStateAtom = atom<StateSnapshot | undefined>(undefined);
