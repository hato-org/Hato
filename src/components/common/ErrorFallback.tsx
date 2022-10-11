import { FallbackProps } from 'react-error-boundary';
import { Button, Center, Code, Heading, VStack } from '@chakra-ui/react';
import { TbLoader, TbRotate } from 'react-icons/tb';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth';
import { useClient } from '@/modules/client';
import { useUser } from '@/hooks/user';

function ErrorFallback({ error }: FallbackProps) {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { client } = useClient();

  const { mutate } = useMutation(async () =>
    client.post('/report', {
      content: null,
      embeds: [
        {
          title: 'Report',
          url: `https://hato.cf/`,
          color: 5814783,
          fields: [
            {
              name: 'Report reason',
              value: 'Application Error',
            },
            {
              name: 'Error Message',
              value: error.message,
            },
          ],
          author: {
            name: user?.name,
            icon_url: user?.avatar,
          },
          footer: {
            text: user?.email,
            icon_url: user?.avatar,
          },
          timestamp: new Date().toISOString(),
        },
      ],
      attachments: [],
    })
  );

  return (
    // @ts-ignore
    <Center h={[['100vh', '100dvh']]} p={8}>
      <VStack spacing={4}>
        <Heading>エラーが発生しました</Heading>
        <Code rounded="md">{error.message}</Code>
        <Button
          leftIcon={<TbRotate />}
          colorScheme="blue"
          rounded="xl"
          onClick={() => {
            mutate();
            window.location.reload();
          }}
        >
          再読み込み
        </Button>
        <Button
          leftIcon={<TbLoader />}
          rounded="xl"
          onClick={async () => {
            mutate();
            logout();
            const dbs = await window.indexedDB?.databases();
            dbs?.forEach((db) => {
              if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
            window.localStorage.clear();
            window.location.replace('/');
          }}
        >
          ログアウト・キャッシュ削除
        </Button>
      </VStack>
    </Center>
  );
}

export default ErrorFallback;
