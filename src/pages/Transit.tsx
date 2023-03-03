import { Box, HStack, Heading, VStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import { useDiainfo } from '@/hooks/transit';
import DiaInfo from '@/components/transit/DiaInfo';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';

function Transit() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useDiainfo();

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
        {/* eslint-disable no-nested-ternary */}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Error error={error} />
        ) : (
          <VStack w="100%" mb={32} p={4} spacing={8}>
            {data?.map((diaInfo) => (
              <DiaInfo key={diaInfo.lineInfo.kana} diaInfo={diaInfo} />
            ))}
          </VStack>
        )}
        {/* eslint-enable */}
      </ChakraPullToRefresh>
    </Box>
  );
}

export default Transit;
