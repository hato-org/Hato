import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useReport = () => {
  const toast = useToast({
    position: 'top-right',
    duration: 1500,
  });
  const { client } = useClient();

  return useMutation<any, AxiosError, ReportSchema>(
    async (report) => (await client.post('/report', report)).data,
    {
      onSuccess: () => {
        toast({
          title: '送信しました。',
          status: 'success',
        });
      },
      onError: (error) => {
        toast({
          title: '送信に失敗しました。',
          description: error.message,
          status: 'error',
        });
      },
    }
  );
};
