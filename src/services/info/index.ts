import { useEffect } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import {
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useGradeList = (
  options?: Omit<UseQueryOptions<GradeList>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['info', 'grade'],
    queryFn: async ({ signal }) =>
      (await client.get<GradeList>('/info/grade', { signal })).data,
  });
};

export const useAllClassList = (
  options: Omit<UseQueryOptions<ClassList>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();
  const { data: gradeList } = useGradeList();

  return useQueries({
    queries:
      gradeList?.map<UseQueryOptions<ClassList>>(({ type, gradeCode }) => ({
        ...options,
        queryKey: ['info', 'class', type, gradeCode],
        queryFn: async ({ signal }) =>
          (
            await client.get<ClassList>('/info/class', {
              params: { type, grade: gradeCode },
              signal,
            })
          ).data,
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
  options?: Omit<UseQueryOptions<ClassList>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['info', 'class', type, grade],
    queryFn: async ({ signal }) =>
      (
        await client.get<ClassList>('/info/class', {
          params: { type, grade },
          signal,
        })
      ).data,
  });
};

export const useCourseList = (
  {
    type,
    grade,
  }: {
    type?: Type;
    grade?: GradeCode;
  },
  options?: Omit<UseQueryOptions<CourseList>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['info', 'course', type, grade],
    queryFn: async ({ signal }) =>
      (
        await client.get<CourseList>('/info/course', {
          params: { type, grade },
          signal,
        })
      ).data,
  });
};

export const useSubjectList = (
  {
    type,
    grade,
  }: {
    type: Type;
    grade: GradeCode;
  },
  options?: Omit<UseQueryOptions<SubjectList>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['info', 'subject', type, grade],
    queryFn: async ({ signal }) =>
      (
        await client.get<SubjectList>('/info/subject', {
          params: { type, grade },
          signal,
        })
      ).data,
  });
};

export const useProfile = () => {
  const { client } = useClient();
  const queryClient = useQueryClient();
  const isDark = useColorModeValue(false, true);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
  }, [queryClient, isDark]);

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async ({ signal }) =>
      (
        await client.get<Blob>('/assets/profile', {
          params: isDark ? { dark: '' } : {},
          responseType: 'blob',
          signal,
        })
      ).data,
  });
};
