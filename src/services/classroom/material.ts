import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { classroom_v1 } from 'googleapis';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useGCCourseworkMaterial = (
  {
    courseId,
    id,
  }: {
    courseId?: string;
    id?: string;
  },
  options?: Omit<
    UseQueryOptions<classroom_v1.Schema$CourseWorkMaterial>,
    'queryKey' | 'queryFn'
  >,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.google.courseWorkMaterial(courseId, id),
    queryFn: async ({ signal }) =>
      await client
        .get(`classroom/course/${courseId}/courseworkmaterial/${id}`, {
          signal,
        })
        .json<classroom_v1.Schema$CourseWorkMaterial>(),
    enabled: !!courseId && !!id,
  });
};
