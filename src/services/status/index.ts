import { useToast } from '@chakra-ui/react';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import ky, { HTTPError } from 'ky';
import { queryKeys } from '../queryKeys';

const STATUS_API_URL = import.meta.env.VITE_STATUS_API_URL;

export const useHatoStatus = () =>
  useQuery({
    queryKey: queryKeys.status.all,
    queryFn: async ({ signal }) =>
      await ky.get('', { prefix: STATUS_API_URL, signal }).json<Status>(),
    refetchInterval: 1000 * 60 * 2,
  });

export const useHatoStatusMaintenance = () =>
  useQuery({
    queryKey: queryKeys.status.maintenance(),
    queryFn: async ({ signal }) =>
      await ky
        .get('info', { prefix: STATUS_API_URL, signal })
        .json<StatusMaintenance[]>(),
  });

export const useHatoStatusMaintenanceMutation = () => {
  const toast = useToast({
    position: 'top-right',
    duration: 1000,
  });

  return useMutation<StatusMaintenance[], HTTPError, StatusMaintenance>({
    mutationFn: async (data) =>
      await ky
        .post('info', {
          prefix: STATUS_API_URL,
          json: data,
        })
        .json<StatusMaintenance[]>(),
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
    queryKey: queryKeys.status.history(id),
    queryFn: async ({ pageParam = 1, signal }) =>
      await ky
        .get('history', {
          prefix: STATUS_API_URL,
          searchParams: { id, page: pageParam },
          signal,
        })
        .json<StatusHistory[]>(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? (Math.ceil(allPages.flat().length / 24 + 1) ?? 1)
        : undefined,
  });

export const useHatoStatusServerList = () =>
  useQuery({
    queryKey: queryKeys.status.servers(),
    queryFn: async ({ signal }) =>
      await ky
        .get('servers', {
          prefix: STATUS_API_URL,
          signal,
        })
        .json<Pick<StatusServer, 'id' | 'name'>[]>(),
  });
