import { useEffect } from 'react';
import { useColorModeValue } from '@chakra-ui/react';
import {
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useGradeList = (
  options?: Omit<UseQueryOptions<GradeList>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.info.grade(),
    queryFn: async ({ signal }) =>
      await client.get('info/grade', { signal }).json<GradeList>(),
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
        queryKey: queryKeys.info.classList(type, gradeCode),
        queryFn: async ({ signal }) =>
          await client
            .get('info/class', {
              searchParams: { type, grade: gradeCode },
              signal,
            })
            .json<ClassList>(),
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
    queryKey: queryKeys.info.classList(type, grade),
    queryFn: async ({ signal }) =>
      await client
        .get('info/class', {
          searchParams: { type: type!, grade: grade! },
          signal,
        })
        .json<ClassList>(),
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
    queryKey: queryKeys.info.courseList(type, grade),
    queryFn: async ({ signal }) =>
      await client
        .get('info/course', {
          searchParams: { type: type!, grade: grade! },
          signal,
        })
        .json<CourseList>(),
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
    queryKey: queryKeys.info.subjectList(type, grade),
    queryFn: async ({ signal }) =>
      await client
        .get('info/subject', {
          searchParams: { type, grade },
          signal,
        })
        .json<SubjectList>(),
  });
};

export const useProfile = () => {
  const { client } = useClient();
  const queryClient = useQueryClient();
  const isDark = useColorModeValue(false, true);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
  }, [queryClient, isDark]);

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async ({ signal }) =>
      await client
        .get('assets/profile', {
          searchParams: isDark ? { dark: '' } : {},
          signal,
        })
        .blob(),
  });
};
