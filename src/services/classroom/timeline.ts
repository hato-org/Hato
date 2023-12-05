import { useInfiniteQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { GCTimeline } from '@/@types/classroom';

export const useGCTimeline = () => {
  const { client } = useClient();

  return useInfiniteQuery({
    queryKey: ['google', 'timeline'],
    queryFn: async ({ pageParam = 1, signal }) =>
      (
        await client.get<GCTimeline[]>('/classroom/timeline', {
          params: { page: pageParam },
          signal,
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? Math.ceil(allPages.flat().length / 50 + 1) ?? 1
        : undefined,
  });
};

export const useGCCourseTimeline = (courseId?: string) => {
  const { client } = useClient();

  return useInfiniteQuery({
    queryKey: ['google', courseId, 'timeline'],
    queryFn: async ({ pageParam = 1, signal }) =>
      (
        await client.get<GCTimeline[]>(
          `/classroom/timeline/course/${courseId}`,
          {
            params: { page: pageParam },
            signal,
          },
        )
      ).data,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? Math.ceil(allPages.flat().length / 50 + 1) ?? 1
        : undefined,
  });
};
