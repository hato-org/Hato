import type { classroom_v1 } from 'googleapis';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useGCCourses = () => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['google', 'courses'],
    queryFn: async () =>
      (
        await client.get<classroom_v1.Schema$ListCoursesResponse>(
          '/classroom/course',
        )
      ).data,
  });
};

export const useGCCourseInfo = (courseId?: string | null) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['google', 'course', courseId],
    queryFn: async () =>
      (
        await client.get<classroom_v1.Schema$Course>(
          `/classroom/course/${courseId}`,
        )
      ).data,
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled: !!courseId,
  });
};
