import type { classroom_v1 } from 'googleapis';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useGCCourses = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['google', 'courses'],
    queryFn: async ({ signal }) =>
      await client
        .get('classroom/course', { signal })
        .json<classroom_v1.Schema$ListCoursesResponse>(),
  });
};

export const useGCCourseInfo = (courseId?: string | null) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['google', 'course', courseId],
    queryFn: async ({ signal }) =>
      await client
        .get(`classroom/course/${courseId}`, { signal })
        .json<classroom_v1.Schema$Course>(),
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: !!courseId,
  });
};
