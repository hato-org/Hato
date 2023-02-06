import { useMemo } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Collapse,
  Heading,
  HStack,
  Icon,
  Link,
  LinkBox,
  Skeleton,
  Spacer,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { differenceInMinutes, differenceInSeconds, format } from 'date-fns/esm';
import { useSeconds } from 'use-seconds';
import { useClient } from '@/modules/client';
import { useDiainfo } from '@/hooks/transit';

const timedifference = (dateLeft: Date, dateRight: Date) => {
  const diffSec = differenceInSeconds(dateLeft, dateRight);
  const diffMin = differenceInMinutes(dateLeft, dateRight);

  return `${diffMin}:${Math.abs(diffSec - 60 * diffMin)
    .toString()
    .padStart(2, '0')}`;
};

export default function Transit() {
  const { client } = useClient();

  const { data, isLoading } = useQuery<Transit>(
    ['transit'],
    async () => (await client.get('/transit')).data,
    {
      refetchInterval: 1000 * 60 * 5, // Refetch in 5 mins
    }
  );
  const { data: diaInfos } = useDiainfo();

  const unstableLines = useMemo(
    () => diaInfos?.filter((diaInfo) => diaInfo.status.code !== 'normal'),
    [diaInfos]
  );

  return (
    <VStack spacing={4} w="100%" align="flex-start">
      <LinkBox w="100%" as={RouterLink} to="/transit">
        <HStack pt={2} pl={2} w="100%">
          <Heading as="h2" size="md">
            交通情報
          </Heading>
          <Spacer />
          <Link
            isExternal
            href="https://transit.yahoo.co.jp"
            textStyle="description"
            color="description"
            fontWeight="bold"
          >
            Yahoo! 路線情報提供
          </Link>
          <Icon as={TbChevronRight} boxSize={5} />
        </HStack>
      </LinkBox>
      <HStack w="100%" p={2}>
        <VStack align="flex-start" w="100%">
          {unstableLines?.length && (
            <Alert status="warning" rounded="lg">
              <VStack w="100%" align="flex-start">
                <HStack spacing={0}>
                  <AlertIcon />
                  <AlertTitle>情報あり</AlertTitle>
                </HStack>
                {unstableLines.map((diaInfo) => (
                  <Text fontSize="sm">
                    {diaInfo.lineInfo.name} （{diaInfo.status.text}）
                  </Text>
                ))}
              </VStack>
            </Alert>
          )}
          <Text textStyle="title" fontSize="lg">
            長野方面
          </Text>
          <Skeleton w="100%" rounded="xl" isLoaded={!isLoading}>
            <TransitButton transits={data?.nagano} />
          </Skeleton>
          <Text textStyle="title" fontSize="lg">
            上田方面
          </Text>
          <Skeleton w="100%" rounded="xl" isLoaded={!isLoading}>
            <TransitButton transits={data?.ueda} />
          </Skeleton>
        </VStack>
      </HStack>
    </VStack>
  );
}

function TransitButton({ transits }: { transits?: TransitInfo[] }) {
  const { isOpen, onToggle } = useDisclosure();
  const [date] = useSeconds();
  const upcomingTransit = transits?.filter(
    (transit) => new Date(transit.leaveAt).valueOf() > Date.now()
  );

  return upcomingTransit?.length ? (
    <VStack w="100%" spacing={0} rounded="xl" layerStyle="button">
      <HStack w="100%" p={2} onClick={onToggle}>
        <StackDivider borderWidth={2} borderColor="blue.400" rounded="full" />
        <VStack spacing={0} align="flex-start">
          <Text textStyle="title" fontSize="xl">
            {format(new Date(upcomingTransit[0].leaveAt), 'HH:mm')}
          </Text>
          <Text textStyle="description">
            {upcomingTransit[0].destination}行
          </Text>
        </VStack>
        <Spacer />
        <Text textStyle="title" fontSize="3xl">
          {timedifference(new Date(upcomingTransit[0].leaveAt), date)}
        </Text>
      </HStack>
      <Box w="100%">
        <Collapse in={isOpen}>
          {upcomingTransit.slice(1).map((transit) => (
            <TransitQueue key={transit.leaveAt} date={date} transit={transit} />
          ))}
        </Collapse>
      </Box>
    </VStack>
  ) : (
    <Center w="100%" py={2}>
      <Text textStyle="description" fontWeight="bold">
        次の電車はありません
      </Text>
    </Center>
  );
}

function TransitQueue({ date, transit }: { date: Date; transit: TransitInfo }) {
  return (
    <HStack w="100%" p={2} pl={6}>
      <StackDivider borderWidth={1} borderColor="blue.400" rounded="full" />
      <VStack spacing={0} align="flex-start">
        <Text fontSize="md">{format(new Date(transit.leaveAt), 'HH:mm')}</Text>
        <Text textStyle="description" fontSize="2xs">
          {transit.destination}行
        </Text>
      </VStack>
      <Spacer />
      <Text textStyle="title">
        {timedifference(new Date(transit.leaveAt), date)}
      </Text>
    </HStack>
  );
}
