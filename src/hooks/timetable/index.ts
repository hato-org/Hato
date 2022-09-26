import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '../../modules/client';
import { useUser } from '../user';

export const useCurrentTable = (queryKey?: string[]) => {
  const { data: user } = useUser();
  const { client } = useClient();

  const params = {
    type: user?.type,
    grade: user?.grade,
    class: user?.class,
    course: user?.course,
  };

  return useQuery<CurrentTimetable, AxiosError>(
    [...(queryKey ?? []), 'timetable', params],
    async () => (await client.get('/timetable/now', { params })).data
  );

  // return useApi<CurrentTimetable, AxiosError, any, any>(
  //   [
  //     "/timetable/v1.1/now",
  //     {
  //       type: user?.type,
  //       grade: user?.grade,
  //       class: user?.class,
  //       course: user?.course,
  //     },
  //     ...(queryKey || []),
  //   ],
  //   {
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );
};

export const useTable = (
  {
    grade,
    class: schoolClass,
    course,
  }: {
    grade: number;
    class: number;
    course: Course;
  },
  queryKey?: string[]
) => {
  const { client } = useClient();

  return useQuery(
    [...(queryKey ?? []), 'timetable'],
    async () =>
      (
        await client.get('/timetable', {
          params: {
            grade,
            class: schoolClass,
            course,
          },
        })
      ).data
  );

  // return useApi<any, AxiosError, any, any>([
  //   "/timetable/v1.1",
  //   {
  //     grade,
  //     class: schoolClass,
  //     course,
  //   },
  //   ...(queryKey || []),
  // ]);
};
