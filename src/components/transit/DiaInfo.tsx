import React from 'react';
import {
  VStack,
  HStack,
  StackDivider,
  Heading,
  Text,
  Center,
} from '@chakra-ui/react';
import { format } from 'date-fns/esm';
import Card from '../layout/Card';

const DiaInfo = React.memo(({ diaInfo }: { diaInfo: DiaInfo }) => {
  const borderColor = (() => {
    switch (diaInfo.status.code) {
      case 'normal':
        return 'green.400';
      case 'trouble':
        return 'yellow.400';
      case 'suspend':
        return 'red.400';
      default:
        return 'blue.400';
    }
  })();

  return (
    <Card w="100%">
      <VStack p={2} align="flex-start" spacing={4}>
        <HStack>
          <StackDivider
            borderWidth="2px"
            rounded="full"
            borderColor={borderColor}
            transition="all .2s ease"
          />
          <VStack align="flex-start" spacing={1}>
            <Heading size="md">{diaInfo.lineInfo.name}</Heading>
            <Text textStyle="description">{diaInfo.status.text}</Text>
          </VStack>
        </HStack>
        <Center w="100%">
          <Text textStyle="title">{diaInfo.description}</Text>
        </Center>
        <Text
          w="100%"
          textAlign="end"
          textStyle="description"
          fontWeight="bold"
        >
          {format(new Date(diaInfo.updatedAt), 'MM/dd HH:mm')} 更新
        </Text>
      </VStack>
    </Card>
  );
});

export default DiaInfo;
