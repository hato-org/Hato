import { useInfiniteQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { GCTimeline } from '@/@types/classroom';

export const useGCTimeline = () => {
  const { client } = useClient();

  return useInfiniteQuery({
    queryKey: ['google', 'timeline'],
    queryFn: async ({ pageParam, signal }) =>
      await client
        .get('classroom/timeline', {
          searchParams: { page: pageParam },
          signal,
        })
        .json<GCTimeline[]>(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length
        ? (Math.ceil(allPages.flat().length / 50 + 1) ?? 1)
        : null,
  });
};

export const useGCCourseTimeline = (courseId?: string) => {
  const { client } = useClient();

  return useInfiniteQuery({
    queryKey: ['google', courseId, 'timeline'],
    queryFn: async ({ pageParam, signal }) =>
      await client
        .get(`classroom/timeline/course/${courseId}`, {
          searchParams: { page: pageParam },
          signal,
        })
        .json<GCTimeline[]>(),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 50
        ? (Math.ceil(allPages.flat().length / 50 + 1) ?? 1)
        : null,
  });
};
