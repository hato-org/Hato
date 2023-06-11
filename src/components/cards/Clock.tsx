import {
  HStack,
  Skeleton,
  Spacer,
  StackDivider,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns/esm';
import { useSeconds } from 'use-seconds';
import { useDivision } from '@/hooks/timetable';
import { days } from '@/utils/date';

export default function Clock() {
  const { isOpen: isSecondsShowed, onToggle } = useDisclosure();
  const [date] = useSeconds();
  const { data: division, isLoading } = useDivision({ date });

  return (
    <HStack w="full" p={2} spacing={4}>
      <StackDivider borderWidth={2} rounded="full" borderColor="blue.400" />
      <VStack spacing={0} align="flex-start">
        {/* <HStack w="full">
          <Text textStyle="title">
            {format(date, 'yyyy')}
            <Text as="span" textStyle="description" fontSize="xs">
              年
            </Text>
          </Text>
          <Spacer />
          <Text textStyle="title">
            {format(date, 'eee', { locale: ja })}
            <Text as="span" textStyle="description" fontSize="xs">
              曜日
            </Text>
          </Text>
        </HStack> */}
        <HStack spacing={1}>
          <Text textStyle="title" fontSize="3xl">
            {format(date, 'M')}
            <Text pl={1} as="span" textStyle="description">
              月
            </Text>
          </Text>
          {/* <Text textStyle='description' fontSize='3xl'>/</Text> */}
          <Text textStyle="title" fontSize="3xl">
            {format(date, 'dd')}
            <Text pl={1} as="span" textStyle="description">
              日
            </Text>
          </Text>
        </HStack>
        {division ? (
          <HStack w="full">
            <Text textStyle="title" fontSize="xl">
              {division.week}
              <Text as="span" textStyle="description">
                週
              </Text>
            </Text>
            {/* <Spacer /> */}
            <Text textStyle="title" fontSize="xl">
              {days[division.day]}
              <Text as="span" textStyle="description">
                曜日課
              </Text>
            </Text>
          </HStack>
        ) : (
          <Skeleton rounded="md" isLoaded={!isLoading}>
            <Text textStyle="description" fontWeight="bold">
              日課未設定
            </Text>
          </Skeleton>
        )}
      </VStack>
      <Spacer />
      <HStack onClick={onToggle}>
        <Text textStyle="title" fontSize="4xl">
          {format(date, 'HH')}
          <Text
            as="span"
            opacity={date.getSeconds() % 2}
            transition="all .2s ease"
          >
            :
          </Text>
          {format(date, 'mm')}
          {isSecondsShowed && (
            <Text as="span" textStyle="description" fontSize="xl">
              <Text
                as="span"
                opacity={date.getSeconds() % 2}
                transition="all .2s ease"
              >
                :
              </Text>
              {format(date, 'ss')}
            </Text>
          )}
        </Text>
      </HStack>
    </HStack>
  );
}
