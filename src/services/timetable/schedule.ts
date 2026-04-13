import {
  UseQueryOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { useUser } from '../user';

export const useDivision = ({ date }: { date: Date }) => {
  const { client } = useClient();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return useQuery({
    queryKey: ['timetable', 'division', { year, month, day }],
    queryFn: async ({ signal }) =>
      await client
        .get('timetable/division', {
          searchParams: { year, month, day },
          signal,
        })
        .json<Division>(),
  });
};

export const useDivisionMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (division: Division) =>
      await client
        .post('timetable/division', { json: division })
        .json<Division>(),
    onSuccess: (division) => {
      const date = new Date(division.date);
      queryClient.setQueryData(
        [
          'timetable',
          'division',
          {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          },
        ],
        division,
      );
    },
  });
};

export const useUserSchedule = (
  id: string,
  options?: Omit<UseQueryOptions<UserSchedule>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['timetable', 'userschedule', id],
    queryFn: async ({ signal }) =>
      await client
        .get(`timetable/userschedule/${id}`, { signal })
        .json<UserSchedule>(),
  });
};

export const useMyUserSchedules = () => {
  const { data: user } = useUser();
  const { client } = useClient();

  return useQuery({
    queryKey: ['timetable', 'userschedule', 'user', user._id],
    queryFn: async ({ signal }) =>
      await client
        .post('timetable/userschedule/search', {
          json: { owner: user._id },
          signal,
        })
        .json<UserSchedule[]>(),
  });
};

export const useUserScheduleSearch = () => {
  const { client } = useClient();

  return useMutation({
    mutationFn: async (query: RecursivePartial<UserSchedule>) =>
      await client
        .post('timetable/userschedule/search', { json: query })
        .json<UserSchedule[]>(),
  });
};

export const useUserScheduleMutation = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (schedule: Partial<UserSchedule>) =>
      await client
        .post('timetable/userschedule', { json: schedule })
        .json<UserSchedule>(),
    onSuccess: (schedule) => {
      queryClient.setQueryData(
        ['timetable', 'userschedule', schedule._id],
        schedule,
      );
      queryClient.invalidateQueries({
        queryKey: ['timetable', 'userschedule', 'user', user._id],
      });
    },
  });
};

export const useDeleteUserScheduleMutation = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (id: string | undefined) =>
      await client.delete(`timetable/userschedule/${id}`).json<UserSchedule>(),
    onSuccess: (schedule) => {
      queryClient.removeQueries({
        queryKey: ['timetable', 'userschedule', schedule._id],
      });
      queryClient.setQueryData<UserSchedule[]>(
        ['timetable', 'userschedule', 'user', user._id],
        (schedules) => schedules?.filter((sch) => sch._id !== schedule._id),
      );
    },
  });
};
