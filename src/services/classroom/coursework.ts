import type { classroom_v1 } from 'googleapis';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

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
    queryKey: ['google', 'courseWork', { courseId, id }],
    queryFn: async () =>
      (
        await client.get<classroom_v1.Schema$CourseWork>(
          `/classroom/course/${courseId}/coursework/${id}`,
        )
      ).data,
  });
};
