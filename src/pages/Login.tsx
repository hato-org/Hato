import { useMemo } from 'react';
import {
  Button,
  Center,
  Heading,
  Text,
  VStack,
  Icon,
  Tooltip,
  useClipboard,
  Alert,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { TbArrowNarrowLeft, TbCheck, TbCopy } from 'react-icons/tb';
import {
  Link as RouterLink,
  Navigate,
  useSearchParams,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import LoginButton from '@/components/login/LoginButton';
import { jwtAtom } from '@/store/auth';

function Login() {
  const jwt = useRecoilValue(jwtAtom);
  const { onCopy, hasCopied } = useClipboard(window.origin);
  const [searchParams] = useSearchParams();
  const isEmbedBrowser = useMemo(
    () => /(Instagram|Line)/.test(navigator.userAgent),
    []
  );

  if (jwt) return <Navigate to={searchParams.get('return_to') ?? '/'} />;

  return (
    <>
      <Helmet>
        <title>ログイン - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      {/* @ts-ignore */}
      <Center h={[['100vh', '100dvh']]} w="100vw" flexDir="column" p={8}>
        <VStack spacing={8} w="100%">
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
              <Alert
                status="warning"
                rounded="xl"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
                textAlign="center"
                p={4}
              >
                <AlertIcon boxSize={8} mr={0} />
                <AlertDescription fontWeight="bold" fontSize="sm">
                  <Tooltip label={navigator.userAgent}>
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
                    leftIcon={
                      <Icon
                        color={hasCopied ? 'green.400' : undefined}
                        as={hasCopied ? TbCheck : TbCopy}
                      />
                    }
                    onClick={onCopy}
                  >
                    リンクをコピー
                  </Button>
                </AlertDescription>
              </Alert>
            </VStack>
          ) : (
            <LoginButton />
          )}
          <Button
            as={RouterLink}
            to="/"
            variant="ghost"
            color="blue.500"
            textStyle="link"
            leftIcon={<TbArrowNarrowLeft />}
          >
            <Text>ホームに戻る</Text>
          </Button>
        </VStack>
      </Center>
    </>
  );
}

export default Login;
