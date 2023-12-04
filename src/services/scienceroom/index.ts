import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useRoomTable = (
  { year: y, month: m, day: d }: { year: number; month: number; day: number },
  options?: Omit<UseQueryOptions<ScienceRoom>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['scienceroom', { y, m, d }],
    queryFn: async () =>
      (await client.get<ScienceRoom>('/scienceroom', { params: { y, m, d } }))
        .data,
  });
};
