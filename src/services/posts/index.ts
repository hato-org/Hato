import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useHatoboard = (
  options?: Omit<UseQueryOptions<Post[]>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    gcTime: Infinity,
    ...options,
    queryKey: ['posts', 'hatoboard'],
    queryFn: async () => (await client.get<Post[]>('/post')).data,
  });
};

export const usePost = (
  id: string,
  options?: Omit<UseQueryOptions<Post>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['post', id],
    queryFn: async () => (await client.get<Post>(`/post/${id}`)).data,
  });
};

export const usePostAttachment = (
  id: string,
  options?: Omit<UseQueryOptions<ArrayBuffer>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['post', 'attachment', id],
    queryFn: async () =>
      (
        await client.get<ArrayBuffer>(`/post/attachment/${id}`, {
          responseType: 'arraybuffer',
        })
      ).data,
  });
};
