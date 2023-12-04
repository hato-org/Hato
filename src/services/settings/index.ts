import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useClient } from '@/modules/client';
import { useUser } from '../user';
import { settingsAtom } from '@/store/settings';

export const useSettings = () => {
  const { data: user } = useUser();
  const { client } = useClient();
  const [settings, setSettings] = useRecoilState(settingsAtom);

  return useQuery({
    queryKey: ['settings', user._id],
    queryFn: async () =>
      (await client.get<Settings>(`/settings/${user._id}`)).data,
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
  const setSettings = useSetRecoilState(settingsAtom);

  return useMutation({
    mutationFn: async (settings: Partial<Settings>) =>
      (await client.post<Settings>(`/settings/${user._id}`, settings)).data,
    onSuccess: (settings) => {
      setSettings(settings);
      queryClient.setQueryData(['settings', user._id], settings);
    },
  });
};
