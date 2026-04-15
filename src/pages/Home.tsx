import { Button, Center, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, Navigate } from 'react-router';
import { useAtomValue } from 'jotai';
import { jwtAtom } from '@/store/auth';

function Home() {
  const jwt = useAtomValue(jwtAtom);

  if (jwt) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Center
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Charkra UI doesn't support `dvh`
        minH={[['100vh', '100dvh']]}
        flexDirection="column"
        p={8}
      >
        <VStack>
          <Image src="/logo_alpha.png" boxSize={72} alt="Hato ロゴ" />
          <Heading
            size="4xl"
            color="blue.500"
            fontWeight="bold"
            fontFamily="Josefin Sans, -apple-system, sans-serif"
          >
            Hato
            <Text
              ml={2}
              as="span"
              fontSize="lg"
              color="blue.300"
              fontWeight="light"
            >
              Beta
            </Text>
          </Heading>
          <Text color="description" fontWeight="bold" textAlign="center">
            屋代高校のすべてが見れるプラットフォーム
            <br />
            （仮）
          </Text>
        </VStack>
        <Button
          w={{ base: '100%', md: 60 }}
          mt={10}
          colorScheme="blue"
          rounded="xl"
          shadow="xl"
          as={RouterLink}
          to="/login"
        >
          ログイン
        </Button>
      </Center>
    </>
  );
}

export default Home;
