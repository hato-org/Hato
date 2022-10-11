import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { TbArrowNarrowLeft } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';
import LoginButton from '@/components/login/LoginButton';
import { useAuth } from '@/modules/auth';

function Login() {
  const { login } = useAuth();

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
          <LoginButton shadow="xl" onCredentialResponse={login} />
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
