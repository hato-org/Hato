import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useDiainfo = (
  options?: UseQueryOptions<DiaInfo[], AxiosError>
) => {
  const { client } = useClient();
  return useQuery<DiaInfo[], AxiosError>(
    ['transit', 'diainfo'],
    async () => (await client.get('/transit/diainfo')).data,
    {
      refetchInterval: 1000 * 60 * 2,
      ...options,
    }
  );
};
