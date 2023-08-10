import { useToast } from '@chakra-ui/react';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const STATUS_API_URL = import.meta.env.VITE_STATUS_API_URL;

export const useHatoStatus = () =>
  useQuery<Status, AxiosError>(
    ['status'],
    async () => (await axios.get('/', { baseURL: STATUS_API_URL })).data,
    {
      refetchInterval: 1000 * 60 * 2,
    }
  );

export const useHatoStatusMaintenance = () =>
  useQuery<StatusMaintenance[], AxiosError>(
    ['status', 'maintenance'],
    async () =>
      (
        await axios.get('/info', {
          baseURL: STATUS_API_URL,
        })
      ).data
  );

export const useHatoStatusMaintenanceMutation = () => {
  const toast = useToast({
    position: 'top-right',
    duration: 1000,
  });

  return useMutation<StatusMaintenance[], AxiosError, StatusMaintenance>(
    async (data) =>
      (
        await axios.post('/info', data, {
          baseURL: STATUS_API_URL,
        })
      ).data,
    {
      onSuccess: () => {
        toast({
          title: '追加しました。',
          status: 'success',
        });
      },
    }
  );
};

export const useHatoStatusHistory = ({ id }: { id: string }) =>
  useInfiniteQuery<StatusHistory[], AxiosError>({
    queryKey: ['status', 'history', id],
    queryFn: async ({ pageParam = 1 }) =>
      (
        await axios.get('/history', {
          baseURL: STATUS_API_URL,
          params: { id, page: pageParam },
        })
      ).data,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? Math.ceil(allPages.flat().length / 24 + 1) ?? 1
        : undefined,
  });

export const useHatoStatusServerList = () =>
  useQuery<Pick<StatusServer, 'id' | 'name'>[], AxiosError>(
    ['status', 'servers'],
    async () => (await axios.get('/servers', { baseURL: STATUS_API_URL })).data
  );
