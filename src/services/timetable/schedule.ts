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
      (
        await client.get<Division>('/timetable/division', {
          params: { year, month, day },
          signal,
        })
      ).data,
  });
};

export const useDivisionMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (division: Division) =>
      (await client.post<Division>('/timetable/division', division)).data,
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
      (
        await client.get<UserSchedule>(`/timetable/userschedule/${id}`, {
          signal,
        })
      ).data,
  });
};

export const useMyUserSchedules = () => {
  const { data: user } = useUser();
  const { client } = useClient();

  return useQuery({
    queryKey: ['timetable', 'userschedule', 'user', user._id],
    queryFn: async ({ signal }) =>
      (
        await client.post<UserSchedule[]>(
          '/timetable/userschedule/search',
          {
            owner: user._id,
          },
          { signal },
        )
      ).data,
  });
};

export const useUserScheduleSearch = () => {
  const { client } = useClient();

  return useMutation({
    mutationFn: async (query: RecursivePartial<UserSchedule>) =>
      (
        await client.post<UserSchedule[]>(
          '/timetable/userschedule/search',
          query,
        )
      ).data,
  });
};

export const useUserScheduleMutation = () => {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (schedule: Partial<UserSchedule>) =>
      (await client.post<UserSchedule>('timetable/userschedule', schedule))
        .data,
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
      (await client.delete<UserSchedule>(`/timetable/userschedule/${id}`)).data,
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
