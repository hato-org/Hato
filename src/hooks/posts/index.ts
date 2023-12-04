import { useRecoilValue } from 'recoil';
import { pinnedPostAtom } from '@/store/posts';

export const usePinnedPosts = (posts?: Post[]) => {
  const pinned = useRecoilValue(pinnedPostAtom);

  return posts?.filter((post) => pinned.some((postId) => postId === post._id));
};
