import { atom, atomFamily } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

interface GCBookmark {
  type: 'announcement' | 'courseWork' | 'courseWorkMaterial';
  courseId: string;
  id: string;
}

export const GCScrollIndexAtomFamily = atomFamily({
  key: 'hato.google.scroll',
  default: 0,
});

export const GCBookmarkAtom = atom<GCBookmark[]>({
  key: 'hato.google.pinned',
  default: [],
  effects: [persistAtom],
});
