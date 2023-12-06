import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';

export const useUserSubject = (
  id: string,
  options?: Omit<UseQueryOptions<UserSubject>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: ['timetable', 'usersubject', id],
    queryFn: async ({ signal }) =>
      (
        await client.get<UserSubject>(`/timetable/userschedule/subject/${id}`, {
          signal,
        })
      ).data,
  });
};

export const useUserSubjectMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (subject: UserSubject) =>
      (
        await client.post<UserSubject>(
          '/timetable/userschedule/subject',
          subject,
        )
      ).data,
    onSuccess: (subject) => {
      queryClient.setQueryData(
        ['timetable', 'usersubject', subject._id],
        subject,
      );
    },
  });
};

export const useSearchUserSubject = () => {
  const { client } = useClient();

  return useMutation({
    mutationFn: async (query: Partial<UserSubject>) =>
      (
        await client.post<UserSubject[]>(
          '/timetable/userschedule/subject/search',
          query,
        )
      ).data,
  });
};
