import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useRoomTable = (
  date: Date,
  options?: UseQueryOptions<ScienceRoom, AxiosError>
) => {
  const { client } = useClient();
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return useQuery<ScienceRoom, AxiosError>(
    ['scienceroom', { y, m, d }],
    async () =>
      (await client.get('/scienceroom', { params: { y, m, d } })).data,
    options
  );
};
