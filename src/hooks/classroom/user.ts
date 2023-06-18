import { useQuery } from '@tanstack/react-query';
import type { classroom_v1 } from 'googleapis';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useGCUserInfo = (userId?: string | null) => {
  const { client } = useClient();

  return useQuery<classroom_v1.Schema$UserProfile>(
    ['google', 'user', userId],
    async () => (await client.get(`/classroom/user/${userId}`)).data,
    {
      staleTime: 1000 * 60 * 60 * 24, // 1 day
      retry: false,
      retryOnMount: false,
      enabled: !!userId,
    }
  );
};
