import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';
import { GCTimeline } from '@/@types/classroom';

// eslint-disable-next-line import/prefer-default-export
export const useGCTimeline = () => {
  const { client } = useClient();

  return useInfiniteQuery<GCTimeline[], AxiosError>({
    queryKey: ['google', 'timeline'],
    queryFn: async ({ pageParam = 1 }) =>
      (await client.get('/classroom/timeline', { params: { page: pageParam } }))
        .data,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? Math.ceil(allPages.flat().length / 50 + 1) ?? 1
        : undefined,
  });
};

export const useGCCourseTimeline = (courseId?: string) => {
  const { client } = useClient();

  return useInfiniteQuery<GCTimeline[], AxiosError>({
    queryKey: ['google', courseId, 'timeline'],
    queryFn: async ({ pageParam = 1 }) =>
      (
        await client.get(`/classroom/timeline/course/${courseId}`, {
          params: { page: pageParam },
        })
      ).data,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? Math.ceil(allPages.flat().length / 50 + 1) ?? 1
        : undefined,
  });
};
