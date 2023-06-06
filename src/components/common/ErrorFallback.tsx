import { useMemo } from 'react';
import { Button, Center, Code, Heading, VStack } from '@chakra-ui/react';
import { TbLoader, TbRotate } from 'react-icons/tb';
import { useRouteError } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { useReport } from '@/hooks/report';

function ErrorFallback() {
  const error = useRouteError() as Error;
  const { logout } = useAuth();

  console.error(error);

  const { mutate } = useReport();

  const report = useMemo<Report>(
    () => ({
      type: 'error',
      title: error.name,
      description: error.message,
      url: window.location.toString(),
    }),
    [error]
  );

  return (
    // @ts-ignore
    <Center h={[['100vh', '100dvh']]} p={8}>
      <VStack spacing={4} userSelect="text">
        <Heading>エラーが発生しました</Heading>
        <Code rounded="md">{error.message}</Code>
        <Button
          leftIcon={<TbRotate />}
          colorScheme="blue"
          rounded="xl"
          onClick={() => {
            if (!import.meta.env.DEV) mutate(report);
            window.location.assign('/');
          }}
        >
          再読み込み
        </Button>
        <Button
          leftIcon={<TbLoader />}
          rounded="xl"
          onClick={async () => {
            if (!import.meta.env.DEV) mutate(report);
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
