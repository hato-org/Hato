import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRecoilValue } from 'recoil';
import { useClient } from '@/modules/client';
import { pinnedPostAtom } from '@/store/posts';

export const usePinnedPosts = (posts?: Post[]) => {
  const pinned = useRecoilValue(pinnedPostAtom);

  return posts?.filter((post) => pinned.some((postId) => postId === post._id));
};

export const useHatoboard = (options?: UseQueryOptions<Post[], AxiosError>) => {
  const { client } = useClient();

  return useQuery<Post[], AxiosError>(
    ['posts', 'hatoboard'],
    async () => (await client.get('/post')).data,
    {
      ...options,
      cacheTime: Infinity,
    }
  );
};
