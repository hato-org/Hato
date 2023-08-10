import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useClient } from '@/modules/client';
import { useUser } from '../user';
import { settingsAtom } from '@/store/settings';

export const useSettings = () => {
  const { data: user } = useUser();
  const { client } = useClient();
  const [settings, setSettings] = useRecoilState(settingsAtom);

  return useQuery<Settings, AxiosError>(
    ['settings', user._id],
    async () => (await client.get(`/settings/${user._id}`)).data,
    {
      placeholderData: settings!,
      enabled: !!user,
      onSuccess: (s) => {
        setSettings(s);
      },
    }
  );
};

export const useSettingsMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast({ position: 'top-right', duration: 1500 });
  const { data: user } = useUser();
  const { client } = useClient();
  const setSettings = useSetRecoilState(settingsAtom);

  return useMutation<Settings, AxiosError, Partial<Settings>>(
    async (settings) =>
      (await client.post(`/settings/${user._id}`, settings)).data,
    {
      onSuccess: (settings) => {
        setSettings(settings);
        queryClient.setQueryData(['settings', user._id], settings);
      },
      onError: (error) => {
        toast({
          title: '更新に失敗しました',
          description: error.message,
          status: 'error',
        });
      },
    }
  );
};
