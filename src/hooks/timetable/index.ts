import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';
import { useUser } from '../user';

export const useDivision = ({ date }: { date: Date }) => {
  const { client } = useClient();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return useQuery<Division, AxiosError>(
    ['timetable', 'division', { year, month, day }],
    async () =>
      (
        await client.get('/timetable/division', {
          params: { year, month, day },
        })
      ).data
  );
};

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

export const useTimetable = (
  {
    date,
    type,
    grade,
    class: schoolClass,
    course,
  }: {
    date: Date;
    type: Type;
    grade: GradeCode;
    class: ClassCode;
    course: CourseCode[];
  },
  options?: UseQueryOptions<DaySchedule[], AxiosError>
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

  return useQuery<DaySchedule[], AxiosError>(
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

export const useDaySchedule = (
  {
    type,
    grade,
    schoolClass,
    course,
    week,
    dayOfWeek,
  }: {
    type: Type;
    grade: GradeCode;
    schoolClass: ClassCode;
    course: CourseCode;
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

export const useSchedule = (
  {
    year,
    month,
    day,
  }: {
    year: number;
    month: number;
    day: number;
  },
  options?: UseMutationOptions<Schedule, AxiosError>
) => {
  const { client } = useClient();
  const params = {
    year,
    month,
    day,
  };
  return useMutation<Schedule, AxiosError>(
    ['timetable', 'schedule', { year, month, day }],
    async () => (await client.get('/timetable/schedule', { params })).data,
    options
  );
};

export const useSchedulePlaceholder = (
  options?: UseQueryOptions<DefaultPeriod[], AxiosError>
) => {
  const { client } = useClient();

  return useQuery<DefaultPeriod[], AxiosError>(
    ['timetable', 'placeholder'],
    async () => (await client.get('/timetable/period')).data,
    options
  );
};
