import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useTransit = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: queryKeys.transit.all,
    queryFn: async ({ signal }) =>
      await client.get('transit', { signal }).json<Transit>(),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 mins
  });
};

export const useTransitTimetable = ({
  dest,
  kind,
}: {
  dest: 'nagano' | 'ueda';
  kind: 'weekdays' | 'saturday' | 'sunday';
}) => {
  const { client } = useClient();

  return useQuery({
    queryKey: queryKeys.transit.timetable(dest, kind),
    queryFn: async ({ signal }) =>
      await client
        .get('transit/timetable', {
          searchParams: { dest, kind },
          signal,
        })
        .json<TransitTimetable[]>(),
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useDiainfo = (
  options?: Omit<UseQueryOptions<DiaInfo[]>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    refetchInterval: 1000 * 60 * 2,
    ...options,
    queryKey: queryKeys.transit.diainfo(),
    queryFn: async ({ signal }) =>
      await client.get('transit/diainfo', { signal }).json<DiaInfo[]>(),
  });
};
