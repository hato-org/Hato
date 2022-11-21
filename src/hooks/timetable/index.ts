import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';
import { useUser } from '../user';

export const useCurrentTable = () => {
  const { data: user } = useUser();
  const { client } = useClient();

  const params = {
    type: user?.type,
    grade: user?.grade,
    class: user?.class,
    course: user?.course,
  };

  return useQuery<CurrentTimetable, AxiosError>(
    ['timetable', 'current', params],
    async () => (await client.get('/timetable/now', { params })).data
  );
};

export const useNotes = ({ date }: { date: Date }) => {
  const { client } = useClient();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return useQuery<Note[], AxiosError>(
    ['timetable', 'note', { year, month, day }],
    async () =>
      (await client.get('/timetable/note', { params: { year, month, day } }))
        .data
  );
};

export const useTable = (
  {
    date,
    type,
    grade,
    class: schoolClass,
    course,
  }: {
    date: Date;
    type: Type;
    grade: number;
    class: number;
    course: Course;
  },
  options?: UseQueryOptions<DaySchedule, AxiosError>
) => {
  const { client } = useClient();

  const params = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    type,
    grade,
    class: schoolClass,
    course,
  };

  return useQuery<DaySchedule, AxiosError>(
    ['timetable', params],
    async () =>
      (
        await client.get('/timetable', {
          params,
        })
      ).data,
    options
  );
};

export const useSchedule = (
  {
    type,
    grade,
    schoolClass,
    course,
    week,
    dayOfWeek,
  }: {
    type: Type;
    grade: number;
    schoolClass: number;
    course: Course;
    week: Week;
    dayOfWeek: Day;
  },
  options?: UseQueryOptions<DaySchedule, AxiosError>
) => {
  const { client } = useClient();

  const params = {
    type,
    grade,
    class: schoolClass,
    course,
    week,
    dayOfWeek,
  };

  return useQuery<DaySchedule, AxiosError>(
    ['timetable', params],
    async () => (await client.get('/timetable', { params })).data,
    options
  );
};
