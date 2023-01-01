import { Box, Heading, HStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import Top from '@/components/library/Top';

export default function Library() {
  return (
    <Box>
      <Helmet>
        <title>図書館 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            図書館
          </Heading>
        </HStack>
      </Header>
      <Top />
    </Box>
  );
}
