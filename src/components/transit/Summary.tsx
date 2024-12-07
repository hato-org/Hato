import React from 'react';
import { Heading, Skeleton, VStack } from '@chakra-ui/react';
import Card from '../layout/Card';
import StatusAlert from './StatusAlert';
import { useDiainfo } from '@/services/transit';
import Error from '../cards/Error';

const TransitSummary = React.memo(() => {
  const { data, status, error } = useDiainfo();

  return (
    <Card w="full">
      <VStack p={2} align="flex-start" spacing={4}>
        <Heading size="md">運行情報</Heading>
        {status === 'error' ? (
          <Error error={error} />
        ) : status === 'pending' ? (
          <Skeleton w="full" h={12} rounded="xl" />
        ) : (
          <StatusAlert defaultOpen lines={data} />
        )}
      </VStack>
    </Card>
  );
});

export default TransitSummary;
