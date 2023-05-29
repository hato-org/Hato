import { useEffect } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import {
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';

export const useGradeList = (
  options?: UseQueryOptions<GradeList, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<GradeList, AxiosError>(
    ['info', 'grade'],
    async () => (await client.get('/info/grade')).data,
    options
  );
};

export const useAllClassList = (
  options: UseQueryOptions<ClassList, AxiosError>
) => {
  const { client } = useClient();
  const { data: gradeList } = useGradeList();

  return useQueries({
    queries:
      gradeList?.map(({ type, gradeCode }) => ({
        queryKey: ['info', 'class', type, gradeCode],
        queryFn: async () =>
          (
            await client.get<ClassList>('/info/class', {
              params: { type, grade: gradeCode },
            })
          ).data,
        ...options,
      })) ?? [],
  });
};

export const useClassList = (
  {
    type,
    grade,
  }: {
    type?: Type;
    grade?: GradeCode;
  },
  options?: UseQueryOptions<ClassList, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<ClassList, AxiosError>(
    ['info', 'class', type, grade],
    async () =>
      (
        await client.get('/info/class', {
          params: {
            type,
            grade,
          },
        })
      ).data,
    options
  );
};

export const useCourseList = (
  {
    type,
    grade,
  }: {
    type?: Type;
    grade?: GradeCode;
  },
  options?: UseQueryOptions<CourseList, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<CourseList, AxiosError>(
    ['info', 'course', type, grade],
    async () =>
      (
        await client.get('/info/course', {
          params: {
            type,
            grade,
          },
        })
      ).data,
    options
  );
};

export const useSubjectList = (
  {
    type,
    grade,
  }: {
    type: Type;
    grade: GradeCode;
  },
  options?: UseQueryOptions<SubjectList, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<SubjectList, AxiosError>(
    ['info', 'subject', type, grade],
    async () =>
      (
        await client.get('/info/subject', {
          params: {
            type,
            grade,
          },
        })
      ).data,
    options
  );
};

export const useProfile = () => {
  const { client } = useClient();
  const queryClient = useQueryClient();
  const isDark = useColorModeValue(false, true);

  useEffect(() => {
    queryClient.invalidateQueries(['user', 'profile']);
  }, [queryClient, isDark]);

  return useQuery<Blob, AxiosError>(
    ['user', 'profile'],
    async () =>
      (
        await client.get('/assets/profile', {
          params: isDark ? { dark: '' } : {},
          responseType: 'blob',
        })
      ).data
  );
};
