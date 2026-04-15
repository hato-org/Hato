import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useNotes = ({
  year,
  month,
  day,
}: {
  year: number;
  month: number;
  day: number;
}) => {
  const { client } = useClient();

  return useQuery({
    queryKey: queryKeys.timetable.note({ year, month, day }),
    queryFn: async ({ signal }) =>
      await client
        .get('timetable/note', {
          searchParams: { year, month, day },
          signal,
        })
        .json<Note[]>(),
  });
};

export const useAddNoteMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (note: Omit<Note, '_id'>) =>
      await client.post('timetable/note', { json: note }).json<Note>(),
    onSuccess: (note) => {
      const date = new Date(note.date);

      queryClient.setQueryData<Note[]>(
        queryKeys.timetable.note({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        }),
        (oldNotes) => [...(oldNotes ?? []), note],
      );
    },
  });
};

type NoteMutationVariable =
  | { action: 'edit'; note: Note; id?: never }
  | { action: 'delete'; note?: never; id: string };

export const useNoteMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async ({ action, note, id }: NoteMutationVariable) =>
      action === 'edit'
        ? await client
            .post(`timetable/note/${note._id}`, { json: note })
            .json<Note>()
        : await client.delete(`timetable/note/${id}`).json<Note>(),
    onSuccess: (note, { action }) => {
      const date = new Date(note.date);

      queryClient.setQueryData<Note[]>(
        queryKeys.timetable.note({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        }),
        (oldNotes) =>
          [
            ...(oldNotes?.filter((oldNote) => oldNote._id !== note._id) ?? []),
            action === 'edit' ? note : [],
          ].flat(),
      );
    },
  });
};
