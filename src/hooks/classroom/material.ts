import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import type { classroom_v1 } from 'googleapis';
import { useClient } from '@/modules/client';

// eslint-disable-next-line import/prefer-default-export
export const useGCCourseworkMaterial = (
  {
    courseId,
    id,
  }: {
    courseId?: string;
    id?: string;
  },
  options?: UseQueryOptions<classroom_v1.Schema$CourseWorkMaterial, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<classroom_v1.Schema$CourseWorkMaterial, AxiosError>(
    ['google', 'courseWorkMaterial', id],
    async () =>
      (
        await client.get(
          `/classroom/course/${courseId}/courseworkmaterial/${id}`
        )
      ).data,
    options
  );
};
