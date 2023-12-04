import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { classroom_v1 } from 'googleapis';
import { useClient } from '@/modules/client';

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
    queryKey: ['google', 'courseWorkMaterial', id],
    queryFn: async () =>
      (
        await client.get<classroom_v1.Schema$CourseWorkMaterial>(
          `/classroom/course/${courseId}/courseworkmaterial/${id}`,
        )
      ).data,
  });
};
