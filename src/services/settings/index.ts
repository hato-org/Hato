import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { useClient } from '@/modules/client';
import { useUser } from '../user';
import { settingsAtom } from '@/store/settings';

export const useSettings = () => {
  const { data: user } = useUser();
  const { client } = useClient();
  const [settings, setSettings] = useAtom(settingsAtom);

  return useQuery({
    queryKey: ['settings', user._id],
    queryFn: async ({ signal }) =>
      await client.get(`settings/${user._id}`, { signal }).json<Settings>(),
    select: (data) => {
      setSettings(data);
      return data;
    },
    placeholderData: settings!,
    enabled: !!user,
  });
};

export const useSettingsMutation = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { client } = useClient();
  const setSettings = useSetAtom(settingsAtom);

  return useMutation({
    mutationFn: async (settings: Partial<Settings>) =>
      await client
        .post(`settings/${user._id}`, { json: settings })
        .json<Settings>(),
    onSuccess: (settings) => {
      setSettings(settings);
      queryClient.setQueryData(['settings', user._id], settings);
    },
  });
};
