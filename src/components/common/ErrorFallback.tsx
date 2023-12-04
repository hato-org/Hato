import { useMemo, useState } from 'react';
import {
  Button,
  Center,
  Checkbox,
  Code,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { TbLoader, TbRotate } from 'react-icons/tb';
import { useRouteError } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { useReport } from '@/services/report';

function ErrorFallback() {
  const error = useRouteError() as Error;
  const { logout } = useAuth();
  const [sendReport, setSendReport] = useState(true);

  console.error(error);

  const { mutate } = useReport();

  const report = useMemo<ReportSchema>(
    () => ({
      type: 'error',
      title: error.name,
      description: error.stack ?? error.message,
      url: window.location.toString(),
    }),
    [error],
  );

  return (
    // @ts-ignore
    <Center w="full" h={[['100vh', '100dvh']]} p={8}>
      <VStack w="full" spacing={4} userSelect="text">
        <Heading>エラーが発生しました</Heading>
        <Code rounded="md">{error.message}</Code>
        <Code
          maxW="full"
          p={2}
          overflowX="auto"
          rounded="lg"
          fontSize="xs"
          whiteSpace="pre"
        >
          {error.stack}
        </Code>
        <Button
          leftIcon={<TbRotate />}
          colorScheme="blue"
          rounded="xl"
          onClick={() => {
            if (!import.meta.env.DEV && sendReport) mutate(report);
            window.location.assign('/');
          }}
        >
          再読み込み
        </Button>
        <Button
          leftIcon={<TbLoader />}
          rounded="xl"
          onClick={async () => {
            if (!import.meta.env.DEV && sendReport) mutate(report);
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
        <Checkbox
          isChecked={sendReport}
          onChange={(e) => setSendReport(e.target.checked)}
          textStyle="title"
        >
          エラーレポートを送信する
        </Checkbox>
      </VStack>
    </Center>
  );
}

export default ErrorFallback;
