import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useHatoboard = (
  options?: Omit<UseQueryOptions<Post[]>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    gcTime: Infinity,
    ...options,
    queryKey: queryKeys.posts.hatoboard(),
    queryFn: async ({ signal }) =>
      await client.get('post', { signal }).json<Post[]>(),
  });
};

export const usePost = (
  id: string,
  options?: Omit<UseQueryOptions<Post>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.posts.detail(id),
    queryFn: async ({ signal }) =>
      await client.get(`post/${id}`, { signal }).json<Post>(),
  });
};

export const usePostAttachment = (
  id: string,
  options?: Omit<UseQueryOptions<ArrayBuffer>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.posts.attachment(id),
    queryFn: async ({ signal }) =>
      await client.get(`post/attachment/${id}`, { signal }).arrayBuffer(),
  });
};
