import {
  Box,
  Center,
  Collapse,
  Heading,
  HStack,
  Icon,
  Link,
  Skeleton,
  Spacer,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { TbExternalLink } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { differenceInMinutes, differenceInSeconds, format } from 'date-fns/esm';
import { useSeconds } from 'use-seconds';
import { useClient } from '@/modules/client';

const timedifference = (dateLeft: Date, dateRight: Date) => {
  const diffSec = differenceInSeconds(dateLeft, dateRight);
  const diffMin = differenceInMinutes(dateLeft, dateRight);

  return `${diffMin}:${Math.abs(diffSec - 60 * diffMin)
    .toString()
    .padStart(2, '0')}`;
};

export default function Transit() {
  const [date] = useSeconds();
  const { client } = useClient();
  const { isOpen: isNaganoOpen, onToggle: onNaganoToggle } = useDisclosure();
  const { isOpen: isUedaOpen, onToggle: onUedaToggle } = useDisclosure();

  const { data, isLoading } = useQuery<Transit>(
    ['transit'],
    async () => (await client.get('/transit')).data
  );

  return (
    <VStack p={2} spacing={4} w="100%" align="flex-start">
      <HStack w="100%">
        <Heading as="h2" size="md">
          鉄道情報
        </Heading>
        <Spacer />
        <HStack spacing={0}>
          <Link
            isExternal
            href="https://transit.yahoo.co.jp"
            textStyle="description"
            color="description"
            fontWeight="bold"
          >
            Yahoo! 路線情報提供
          </Link>
          <Icon pl={1} as={TbExternalLink} />
        </HStack>
      </HStack>
      <HStack w="100%">
        <VStack align="flex-start" w="100%">
          <Text textStyle="title" fontSize="lg">
            長野方面
          </Text>
          <Skeleton w="100%" rounded="xl" isLoaded={!isLoading}>
            <TransitButton
              date={date}
              transits={data?.nagano}
              isOpen={isNaganoOpen}
              onToggle={onNaganoToggle}
            />
          </Skeleton>
          <Text textStyle="title" fontSize="lg">
            上田方面
          </Text>
          <Skeleton w="100%" rounded="xl" isLoaded={!isLoading}>
            <TransitButton
              date={date}
              transits={data?.ueda}
              isOpen={isUedaOpen}
              onToggle={onUedaToggle}
            />
          </Skeleton>
        </VStack>
      </HStack>
    </VStack>
  );
}

function TransitButton({
  transits,
  date,
  isOpen,
  onToggle,
}: {
  transits?: TransitInfo[];
  date: Date;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const upcomingTransit = transits?.filter(
    (transit) => new Date(transit.leaveAt).valueOf() > Date.now()
  );

  return upcomingTransit?.length ? (
    <VStack w="100%" spacing={0} rounded="xl" layerStyle="button">
      <HStack w="100%" p={2} onClick={onToggle}>
        <StackDivider borderWidth={2} borderColor="blue.400" />
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
      <StackDivider borderWidth={1} borderColor="blue.400" />
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
