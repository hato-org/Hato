import { useToast } from '@chakra-ui/react';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

const STATUS_API_URL = import.meta.env.VITE_STATUS_API_URL;

export const useHatoStatus = () =>
  useQuery({
    queryKey: ['status'],
    queryFn: async () =>
      (await axios.get<Status>('/', { baseURL: STATUS_API_URL })).data,
    refetchInterval: 1000 * 60 * 2,
  });

export const useHatoStatusMaintenance = () =>
  useQuery({
    queryKey: ['status', 'maintenance'],
    queryFn: async () =>
      (
        await axios.get<StatusMaintenance[]>('/info', {
          baseURL: STATUS_API_URL,
        })
      ).data,
  });

export const useHatoStatusMaintenanceMutation = () => {
  const toast = useToast({
    position: 'top-right',
    duration: 1000,
  });

  return useMutation<StatusMaintenance[], AxiosError, StatusMaintenance>({
    mutationFn: async (data) =>
      (
        await axios.post('/info', data, {
          baseURL: STATUS_API_URL,
        })
      ).data,
    onSuccess: () => {
      toast({
        title: '追加しました。',
        status: 'success',
      });
    },
  });
};

export const useHatoStatusHistory = ({ id }: { id: string }) =>
  useInfiniteQuery({
    queryKey: ['status', 'history', id],
    queryFn: async ({ pageParam = 1 }) =>
      (
        await axios.get<StatusHistory[]>('/history', {
          baseURL: STATUS_API_URL,
          params: { id, page: pageParam },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? Math.ceil(allPages.flat().length / 24 + 1) ?? 1
        : undefined,
  });

export const useHatoStatusServerList = () =>
  useQuery({
    queryKey: ['status', 'servers'],
    queryFn: async () =>
      (
        await axios.get<Pick<StatusServer, 'id' | 'name'>[]>('/servers', {
          baseURL: STATUS_API_URL,
        })
      ).data,
  });
