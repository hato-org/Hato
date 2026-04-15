import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { StateSnapshot } from 'react-virtuoso';
import { createVersionedStorage } from '@/utils/versionedStorage';

const pinnedPostStorage = createVersionedStorage<string[]>({
  version: 1,
  migrate: (old) => (Array.isArray(old) ? (old as string[]) : []),
});

export const pinnedPostAtom = atomWithStorage<string[]>(
  'hato.posts.pinned',
  [],
  pinnedPostStorage,
);

export const postsScrollStateAtom = atom<StateSnapshot | undefined>(undefined);
