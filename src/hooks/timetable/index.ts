import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
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

export const useUserSchedule = (
  { id }: { id: string },
  options?: UseQueryOptions<UserSchedule, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<UserSchedule, AxiosError>(
    ['timetable', 'userschedule', id],
    async () => (await client.get(`/timetable/userschedule/${id}`)).data,
    options
  );
};

export const useMyUserSchedules = () => {
  const { data: user } = useUser();
  const { client } = useClient();

  return useQuery<UserSchedule[], AxiosError>(
    ['timetable', 'userschedule', 'user', user._id],
    async () =>
      (await client.post('/timetable/userschedule/search', { owner: user._id }))
        .data
  );
};

export const useUserScheduleMutation = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation<UserSchedule, AxiosError, UserSchedule>(
    async (schedule) =>
      (await client.post('timetable/userschedule', schedule)).data,
    {
      onSuccess: (schedule) => {
        queryClient.setQueryData(
          ['timetable', 'userschedule', schedule._id],
          schedule
        );
        queryClient.invalidateQueries([
          'timetable',
          'userschedule',
          'user',
          user._id,
        ]);
        console.log(schedule);
      },
    }
  );
};

export const useUserScheduleDeleter = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation<UserSchedule, AxiosError, string | undefined>(
    async (id) => (await client.delete(`/timetable/userschedule/${id}`)).data,
    {
      onSuccess: (schedule) => {
        queryClient.removeQueries(['timetable', 'userschedule', schedule._id]);
        queryClient.setQueryData<UserSchedule[]>(
          ['timetable', 'userschedule', 'user', user._id],
          (schedules) => schedules?.filter((sch) => sch._id !== schedule._id)
        );
      },
    }
  );
};

export const useUserSubject = (
  { id }: { id: string },
  options?: UseQueryOptions<UserSubject, AxiosError>
) => {
  const { client } = useClient();

  return useQuery<UserSubject, AxiosError>(
    ['timetable', 'usersubject', id],
    async () =>
      (await client.get(`/timetable/userschedule/subject/${id}`)).data,
    options
  );
};

export const useUserSubjectMutation = () => {
  const toast = useToast({
    position: 'top-right',
  });
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation<UserSubject, AxiosError, UserSubject>(
    async (subject) =>
      (await client.post('/timetable/userschedule/subject', subject)).data,
    {
      onSuccess: (subject) => {
        queryClient.setQueryData(
          ['timetable', 'usersubject', subject._id],
          subject
        );
      },
      onError: (error) => {
        toast({
          status: 'error',
          title: 'エラーが発生しました',
          description: error.message,
        });
      },
    }
  );
};

export const useUserSubjectSearch = () => {
  const { client } = useClient();

  return useMutation<UserSubject[], AxiosError, Partial<UserSubject>>(
    async (query) =>
      (await client.post('/timetable/userschedule/subject/search', query)).data
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
    grade: number;
    class: number;
    course: Course[];
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
