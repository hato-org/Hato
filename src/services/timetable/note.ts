import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useClient } from '@/modules/client';

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
    queryKey: ['timetable', 'note', { year, month, day }],
    queryFn: async () =>
      (
        await client.get<Note[]>('/timetable/note', {
          params: { year, month, day },
        })
      ).data,
  });
};

export const useAddNoteMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (note: Omit<Note, '_id'>) =>
      (await client.post<Note>('/timetable/note', note)).data,
    onSuccess: (note) => {
      const date = new Date(note.date);

      queryClient.setQueryData<Note[]>(
        [
          'timetable',
          'note',
          {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          },
        ],
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
        ? (await client.post<Note>(`/timetable/note/${note._id}`, note)).data
        : (await client.delete<Note>(`/timetable/note/${id}`)).data,
    onSuccess: (note, { action }) => {
      const date = new Date(note.date);

      queryClient.setQueryData<Note[]>(
        [
          'timetable',
          'note',
          {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
          },
        ],
        (oldNotes) =>
          [
            ...(oldNotes?.filter((oldNote) => oldNote._id !== note._id) ?? []),
            action === 'edit' ? note : [],
          ].flat(),
      );
    },
  });
};
