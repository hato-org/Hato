import { useMemo } from 'react';
import {
  Button,
  Center,
  Heading,
  Text,
  VStack,
  Icon,
  useClipboard,
  Alert,
} from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip';
import { Helmet } from 'react-helmet-async';
import { TbArrowNarrowLeft, TbCheck, TbCopy } from 'react-icons/tb';
import { Link as RouterLink, Navigate, useSearchParams } from 'react-router';
import { useAtomValue } from 'jotai';
import LoginButton from '@/components/login/LoginButton';
import { jwtAtom } from '@/store/auth';

function Login() {
  const jwt = useAtomValue(jwtAtom);
  const { copy, copied } = useClipboard({
    value: window.location.toString(),
  });
  const [searchParams] = useSearchParams();
  const isEmbedBrowser = useMemo(
    () => /(Instagram|Line)/.test(navigator.userAgent),
    [],
  );

  if (jwt) return <Navigate to={searchParams.get('return_to') ?? '/'} />;

  return (
    <>
      <Helmet>
        <title>ログイン - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore: Chakra UI doesn't support `dvh` */}
      <Center h={[['100vh', '100dvh']]} w="100vw" flexDir="column" p={8}>
        <VStack gap={8} w="100%">
          <Heading color="blue.500" as="h1" size="2xl" fontWeight="black">
            ログイン
          </Heading>
          <Text textAlign="center" textStyle="title">
            Hatoを利用するには、
            <br />
            学校所持のGoogleアカウント
            <br />
            (~@g.nagano-c.ed.jp)
            <br />
            でログインしてください。
          </Text>
          {isEmbedBrowser ? (
            <VStack w="full">
              <Alert.Root
                status="warning"
                rounded="xl"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
                textAlign="center"
                p={4}
              >
                <Alert.Indicator boxSize={8} mr={0} />
                <Alert.Description fontWeight="bold" fontSize="sm">
                  <Tooltip content={navigator.userAgent}>
                    お使いのブラウザ
                  </Tooltip>
                  では
                  <br />
                  正常にログインできません。
                  <br />
                  他のブラウザで開いてみてください。
                  <Button
                    mt={2}
                    variant="ghost"
                    rounded="lg"
                    onClick={copy}
                  >
                    <Icon
                      color={copied ? 'green.400' : undefined}
                      as={copied ? TbCheck : TbCopy}
                    />
                    リンクをコピー
                  </Button>
                </Alert.Description>
              </Alert.Root>
            </VStack>
          ) : (
            <LoginButton />
          )}
          <Button
            asChild
            variant="ghost"
            color="blue.500"
            textStyle="link"
          >
            <RouterLink to="/">
              <TbArrowNarrowLeft />
              <Text>ホームに戻る</Text>
            </RouterLink>
          </Button>
        </VStack>
      </Center>
    </>
  );
}

export default Login;
