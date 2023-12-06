import { atom } from 'jotai';
import { atomWithStorage, atomFamily } from 'jotai/utils';
import { StateSnapshot } from 'react-virtuoso';

interface GCBookmark {
  type: 'announcement' | 'courseWork' | 'courseWorkMaterial';
  courseId: string;
  id: string;
}

export const GCScrollIndexAtomFamily = atomFamily(() =>
  atom<StateSnapshot | undefined>(undefined),
);

export const GCBookmarkAtom = atomWithStorage<GCBookmark[]>(
  'hato.google.pinned',
  [],
);
