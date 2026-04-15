import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useRoomTable = (
  { year: y, month: m, day: d }: { year: number; month: number; day: number },
  options?: Omit<UseQueryOptions<ScienceRoom>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.scienceroom.table({ y, m, d }),
    queryFn: async ({ signal }) =>
      await client
        .get('scienceroom', {
          searchParams: { y, m, d },
          signal,
        })
        .json<ScienceRoom>(),
  });
};
