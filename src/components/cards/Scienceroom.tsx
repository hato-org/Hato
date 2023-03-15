import { Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { format } from 'date-fns/esm';
import { ja } from 'date-fns/esm/locale';
import ScienceRoomTableTable from '../scienceroom/Table';

export default function Scienceroom() {
  const date = new Date();

  return (
    <VStack w="100%" p={2} align="flex-start" spacing={4}>
      <HStack w="100%">
        <Heading as="h2" size="md">
          理科室割
        </Heading>
        <Spacer />
        <Text textStyle="description" fontWeight="bold">
          {format(date, 'MM/dd (eee)', { locale: ja })}
        </Text>
      </HStack>
      <ScienceRoomTableTable date={date} />
    </VStack>
  );
}
