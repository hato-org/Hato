import { Box, HStack, Heading, VStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import TransitSummary from '@/components/transit/Summary';
import UpcomingTrains from '@/components/transit/Upcoming';

function Transit() {
  const queryClient = useQueryClient();

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
          await queryClient.invalidateQueries({ queryKey: ['transit'] });
        }}
      >
        <VStack w="100%" mb={32} p={4} spacing={8}>
          <UpcomingTrains />
          <TransitSummary />
        </VStack>
      </ChakraPullToRefresh>
    </Box>
  );
}

export default Transit;
