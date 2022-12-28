import { useQueries, useQuery, UseQueryOptions } from '@tanstack/react-query';
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
      gradeList?.map((gradeInfo) => ({
        queryKey: ['info', 'class', gradeInfo.type, gradeInfo.grade_num],
        queryFn: async () =>
          (
            await client.get<ClassList>('/info/class', {
              params: { type: gradeInfo.type, grade: gradeInfo.grade_num },
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
    grade?: number;
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
    grade?: number;
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
    grade: number;
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
