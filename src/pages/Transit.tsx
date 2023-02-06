import { Box, HStack, Heading, VStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import { useDiainfo } from '@/hooks/transit';
import DiaInfo from '@/components/transit/DiaInfo';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';

function Transit() {
  const queryClient = useQueryClient();
  const { data } = useDiainfo();

  return (
    <Box>
      <Helmet>
        <title>交通情報 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            交通情報
          </Heading>
        </HStack>
      </Header>
      <ChakraPullToRefresh
        onRefresh={async () => {
          await queryClient.invalidateQueries(['transit']);
        }}
      >
        <VStack w="100%" mb={32} p={4} spacing={8}>
          {data?.map((diaInfo) => (
            <DiaInfo diaInfo={diaInfo} />
          ))}
        </VStack>
      </ChakraPullToRefresh>
    </Box>
  );
}

export default Transit;
