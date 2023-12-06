import { useAtomValue } from 'jotai';
import { pinnedPostAtom } from '@/store/posts';

export const usePinnedPosts = (posts?: Post[]) => {
  const pinned = useAtomValue(pinnedPostAtom);

  return posts?.filter((post) => pinned.some((postId) => postId === post._id));
};
