import { atom } from 'jotai';
import { atomWithStorage, atomFamily } from 'jotai/utils';
import { StateSnapshot } from 'react-virtuoso';
import { createVersionedStorage } from '@/utils/versionedStorage';

interface GCBookmark {
  type: 'announcement' | 'courseWork' | 'courseWorkMaterial';
  courseId: string;
  id: string;
}

export const GCScrollIndexAtomFamily = atomFamily(() =>
  atom<StateSnapshot | undefined>(undefined),
);

const gcBookmarkStorage = createVersionedStorage<GCBookmark[]>({
  version: 1,
  migrate: (old) => (Array.isArray(old) ? (old as GCBookmark[]) : []),
});

export const GCBookmarkAtom = atomWithStorage<GCBookmark[]>(
  'hato.google.pinned',
  [],
  gcBookmarkStorage,
);
