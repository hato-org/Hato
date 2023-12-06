import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useTransit = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['transit'],
    queryFn: async ({ signal }) =>
      (await client.get<Transit>('/transit', { signal })).data,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 mins
  });
};

export const useDiainfo = (
  options?: Omit<UseQueryOptions<DiaInfo[]>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    refetchInterval: 1000 * 60 * 2,
    ...options,
    queryKey: ['transit', 'diainfo'],
    queryFn: async ({ signal }) =>
      (await client.get<DiaInfo[]>('/transit/diainfo', { signal })).data,
  });
};
