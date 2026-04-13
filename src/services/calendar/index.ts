import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { eachMonthOfInterval } from 'date-fns';
import { useClient } from '@/modules/client';

export const useEvents = (
  { year, month, day }: { year: number; month: number; day?: number },
  options?: Omit<UseQueryOptions<CalendarEvent[]>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['calendar', 'events', { year, month, day }],
    queryFn: async ({ signal }) =>
      await client
        .get('calendar/event', {
          searchParams: {
            y: year,
            m: month,
            ...(day !== undefined && { d: day }),
          },
          signal,
        })
        .json<CalendarEvent[]>(),
    gcTime: Infinity,
    ...options,
  });
};

export const useEvent = (id: string) => {
  const { client } = useClient();

  return useQuery({
    queryKey: ['calendar', 'event', id],
    queryFn: async ({ signal }) =>
      await client
        .get(`calendar/event/${id}`, { signal })
        .json<CalendarEvent>(),
  });
};

export const useAddEventMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (event: Omit<CalendarEvent, '_id'>) =>
      await client
        .post('calendar/event', { json: event })
        .json<CalendarEvent>(),
    onSuccess: (event) => {
      const startAt = new Date(event.startAt);
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
        ? await client
            .post(`calendar/event/${event._id}`, { json: event })
            .json<CalendarEvent>()
        : await client.delete(`calendar/event/${id}`).json<CalendarEvent>(),
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
      await client.post('calendar/tags/search', { json: { q } }).json<Tag[]>(),
  });
};
