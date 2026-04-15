import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { queryKeys } from '../queryKeys';

export const useUserSubject = (
  id: string,
  options?: Omit<UseQueryOptions<UserSubject>, 'queryKey' | 'queryFn'>,
) => {
  const { client } = useClient();

  return useQuery({
    ...options,
    queryKey: queryKeys.timetable.userSubject(id),
    queryFn: async ({ signal }) =>
      await client
        .get(`timetable/userschedule/subject/${id}`, { signal })
        .json<UserSubject>(),
  });
};

export const useUserSubjectMutation = () => {
  const queryClient = useQueryClient();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (subject: UserSubject) =>
      await client
        .post('timetable/userschedule/subject', { json: subject })
        .json<UserSubject>(),
    onSuccess: (subject) => {
      queryClient.setQueryData(
        queryKeys.timetable.userSubject(subject._id),
        subject,
      );
    },
  });
};

export const useSearchUserSubject = () => {
  const { client } = useClient();

  return useMutation({
    mutationFn: async (query: Partial<UserSubject>) =>
      await client
        .post('timetable/userschedule/subject/search', { json: query })
        .json<UserSubject[]>(),
  });
};
