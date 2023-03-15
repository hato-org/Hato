import type { classroom_v1 } from 'googleapis';
import { AxiosError } from 'axios';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useGCCourseWork = (
  {
    courseId,
    id,
  }: {
    courseId?: string;
    id?: string;
  },
  options?: UseQueryOptions<classroom_v1.Schema$CourseWork, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<classroom_v1.Schema$CourseWork, AxiosError>(
    ['google', 'courseWork', { courseId, id }],
    async () =>
      (await client.get(`/classroom/course/${courseId}/coursework/${id}`)).data,
    options
  );
};
