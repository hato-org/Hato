import { useQuery } from '@tanstack/react-query';
import type { classroom_v1 } from 'googleapis';
import { useClient } from '@/modules/client';

export const useGCUserInfo = (userId?: string | null) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['google', 'user', userId],
    queryFn: async ({ signal }) =>
      (
        await client.get<classroom_v1.Schema$UserProfile>(
          `/classroom/user/${userId}`,
          { signal },
        )
      ).data,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    retry: false,
    retryOnMount: false,
    enabled: !!userId,
  });
};
