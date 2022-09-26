import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Center
        // @ts-ignore
        minH={[['100vh', '100dvh']]}
        flexDirection="column"
        p={8}
      >
        <VStack>
          <Heading size="4xl" color="blue.500">
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
          <Text color="gray.500" fontWeight="bold" textAlign="center">
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
