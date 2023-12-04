import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { eachMonthOfInterval } from 'date-fns/esm';
import { useClient } from '@/modules/client';

export const useEvents = (
  { year, month, day }: { year: number; month: number; day?: number },
  options?: Omit<UseQueryOptions<CalendarEvent[]>, 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['calendar', 'events', { year, month, day }],
    queryFn: async () =>
      (
        await client.get<CalendarEvent[]>('/calendar/event', {
          params: { y: year, m: month, d: day },
        })
      ).data,
    gcTime: Infinity,
    // onSuccess: (data) => {
    //   data.forEach((event) => {
    //     queryClient.setQueryData(['calendar', 'event', event._id], event);
    //   });
    // },
    // onError: (error) => {
    //   toast({
    //     position: 'top-right',
    //     variant: 'left-accent',
    //     status: 'error',
    //     title: 'データを取得できませんでした',
    //     description: error.message,
    //   });
    // },
    ...options,
  });
};

export const useEvent = (id: string) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['calendar', 'event', id],
    queryFn: async () =>
      (await client.get<CalendarEvent>(`/calendar/event/${id}`)).data,
  });
};

export const useAddEventMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (event: Omit<CalendarEvent, '_id'>) =>
      (await client.post<CalendarEvent>('/calendar/event', event)).data,
    onSuccess: (event) => {
      const startAt = new Date(event.startAt);
      // toast({
      //   title: '予定を追加しました。',
      //   status: 'success',
      // });
      queryClient.setQueryData<CalendarEvent[]>(
        [
          'calendar',
          'events',
          {
            month: Number(startAt.getMonth()) + 1,
            year: startAt.getFullYear(),
          },
        ],
        (oldEvents) => [...(oldEvents ?? []), event],
      );
      queryClient.setQueryData(['calendar', 'event', event._id], event);
    },
    // onError: (error) => {
    // toast({
    //   title: '予定の追加に失敗しました。',
    //   description: error.message,
    //   status: 'error',
    // });
    // },
  });
};

type EventMutationVariable =
  | { action: 'edit'; event: CalendarEvent; id?: never }
  | { action: 'delete'; event?: never; id: string };

export const useEventMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async ({ action, event, id }: EventMutationVariable) =>
      action === 'edit'
        ? (
            await client.post<CalendarEvent>(
              `/calendar/event/${event._id}`,
              event,
            )
          ).data
        : (await client.delete<CalendarEvent>(`/calendar/event/${id}`)).data,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ['calendar', 'event', data._id] });

      const monthRange = eachMonthOfInterval({
        start: new Date(data.startAt),
        end: new Date(data.endAt),
      });

      monthRange.forEach((month) => {
        queryClient.setQueryData<CalendarEvent[]>(
          [
            'calendar',
            'events',
            { month: month.getMonth() + 1, year: month.getFullYear() },
          ],
          (oldEvents) =>
            oldEvents?.filter((oldEvent) => oldEvent._id !== data?._id),
        );
      });
    },
  });
};

export const useTagsSearch = () => {
  const { client } = useClient();

  return useMutation({
    mutationFn: async (q: string) =>
      (await client.post<Tag[]>('/calendar/tags/search', { q })).data,
  });
};
