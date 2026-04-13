import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { useUser } from '../user';

export const useSettings = () => {
  const { data: user } = useUser();
  const { client } = useClient();

  return useQuery({
    queryKey: ['settings', user._id],
    queryFn: async ({ signal }) =>
      await client.get(`settings/${user._id}`, { signal }).json<Settings>(),
    enabled: !!user,
  });
};

export const useSettingsMutation = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { client } = useClient();

  return useMutation({
    mutationFn: async (settings: Partial<Settings>) =>
      await client
        .post(`settings/${user._id}`, { json: settings })
        .json<Settings>(),
    onSuccess: (settings) => {
      queryClient.setQueryData(['settings', user._id], settings);
    },
  });
};
