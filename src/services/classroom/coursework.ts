import type { classroom_v1 } from 'googleapis';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useGCCourseWork = (
  {
    courseId,
    id,
  }: {
    courseId?: string;
    id?: string;
  },
  options?: Omit<
    UseQueryOptions<classroom_v1.Schema$CourseWork>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.google.courseWork(courseId, id),
    queryFn: async ({ signal }) =>
      await client
        .get(`classroom/course/${courseId}/coursework/${id}`, { signal })
        .json<classroom_v1.Schema$CourseWork>(),
    enabled: !!courseId && !!id,
  });
};
