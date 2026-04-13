import { HTTPError } from 'ky';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useReport = (
  options?: UseMutationOptions<unknown, HTTPError, ReportSchema>,
) => {
  const { client } = useClient();

  return useMutation({
    ...options,
    mutationFn: async (report: ReportSchema) =>
      await client.post('report', { json: report }).json(),
  });
};
