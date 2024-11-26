import React from 'react';
import {
  Center,
  Heading,
  HStack,
  Skeleton,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useSeconds } from 'use-seconds';
import { differenceInMinutes, differenceInSeconds, format } from 'date-fns/esm';
import Card from '../layout/Card';
import { useTransitTimetable } from '@/services/transit';
import { TrainTimetableModal } from './Timetable';

type UpcomingTrain = TransitTimetable & {
  name?: string;
  arriveAt: Date;
  departAt: Date;
};

const formatTimeStringToDate = (date: Date, timeString?: string) =>
  new Date(
    `${format(date, 'yyyy-MM-dd')}T${timeString?.padStart(5, '0')}:00+0900`,
  );

const formatTimeDifference = (dateLeft: Date, dateRight: Date) => {
  const diffSec = differenceInSeconds(dateLeft, dateRight);
  const diffMin = differenceInMinutes(dateLeft, dateRight);

  return `${diffMin}:${Math.abs(diffSec - 60 * diffMin)
    .toString()
    .padStart(2, '0')}`;
};

const UpcomingTrains = React.memo(() => {
  const [date] = useSeconds();

  const { data: nagano, isPending: isNaganoPending } = useTransitTimetable({
    dest: 'nagano',
    kind: date.getDay() ? 'weekdays' : 'sunday',
  });

  const { data: ueda, isPending: isUedaPending } = useTransitTimetable({
    dest: 'ueda',
    kind: date.getDay() ? 'weekdays' : 'sunday',
  });

  const naganoUpcoming = nagano
    ?.map(({ starting, destination, stations }) => {
      const yashiroSta = stations.find(({ name }) => name === '屋代高校前');

      const arriveDate = formatTimeStringToDate(date, yashiroSta?.arriveAt);
      const departDate = formatTimeStringToDate(date, yashiroSta?.departAt);

      return {
        starting,
        destination,
        stations,
        arriveAt: arriveDate,
        departAt: departDate,
      };
    })
    .filter(({ departAt }) => departAt > date);

  const uedaUpcoming = ueda
    ?.map(({ starting, destination, stations }) => {
      const yashiroSta = stations.find(({ name }) => name === '屋代高校前');

      const arriveDate = formatTimeStringToDate(date, yashiroSta?.arriveAt);
      const departDate = formatTimeStringToDate(date, yashiroSta?.departAt);

      return {
        starting,
        destination,
        stations,
        arriveAt: arriveDate,
        departAt: departDate,
      };
    })
    .filter(({ departAt }) => departAt > date);

  return (
    <Card w="full">
      <VStack p={2} align="flex-start" spacing={4}>
        <Heading size="md">これからの列車</Heading>
        <VStack p={2} align="flex-start" w="100%">
          <Text textStyle="title" fontSize="lg">
            長野方面
          </Text>
          <VStack w="full">
            <Skeleton w="full" rounded="xl" isLoaded={!isNaganoPending}>
              <PrimaryUpcomingTrainCountdown
                date={date}
                train={naganoUpcoming?.[0]}
                openModal
              />
              {(naganoUpcoming?.length ?? 0) > 2 && (
                <Stack direction={{ base: 'column', md: 'row' }} w="full">
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={naganoUpcoming?.[1]}
                  />
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={naganoUpcoming?.[2]}
                  />
                </Stack>
              )}
            </Skeleton>
          </VStack>
          {/* <Skeleton w="100%" rounded="xl" isLoaded={!isNaganoPending}>
            <TransitButton trains={nagano} />
          </Skeleton> */}
          <Text textStyle="title" fontSize="lg">
            上田方面
          </Text>
          <VStack w="full">
            <Skeleton w="full" rounded="xl" isLoaded={!isUedaPending}>
              <PrimaryUpcomingTrainCountdown
                date={date}
                train={uedaUpcoming?.[0]}
                openModal
              />
              {(uedaUpcoming?.length ?? 0) > 2 && (
                <HStack
                  flexDirection={{ base: 'column', md: 'unset' }}
                  spacing={{ base: 0, md: 2 }}
                  w="full"
                >
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={uedaUpcoming?.[1]}
                  />
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={uedaUpcoming?.[2]}
                  />
                </HStack>
              )}
            </Skeleton>
          </VStack>
        </VStack>
      </VStack>
    </Card>
  );
});

const PrimaryUpcomingTrainCountdown = React.memo(
  ({
    date,
    train,
    openModal,
  }: {
    date: Date;
    train?: UpcomingTrain;
    openModal?: boolean;
  }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return train ? (
      <>
        <HStack
          w="full"
          p={2}
          rounded="xl"
          layerStyle={openModal ? 'button' : undefined}
          onClick={onOpen}
        >
          <StackDivider borderWidth={2} borderColor="blue.400" rounded="full" />
          <VStack spacing={0} align="flex-start">
            <Text textStyle="title" fontSize="xl">
              {format(train.departAt, 'HH:mm')}
            </Text>
            <Text textStyle="description">{train.destination}行</Text>
          </VStack>
          <Spacer />
          <Text textStyle="title" fontSize="3xl">
            {formatTimeDifference(train.departAt, date)}
          </Text>
        </HStack>
        {openModal && (
          <TrainTimetableModal {...train} isOpen={isOpen} onClose={onClose} />
        )}
      </>
    ) : (
      <Center w="full" py={2}>
        <Text textStyle="description" fontWeight="bold">
          本日は終了しました
        </Text>
      </Center>
    );
  },
);
const SecondoryUpcomingTrainCountdown = React.memo(
  ({ date, train }: { date: Date; train?: UpcomingTrain }) =>
    train ? (
      <HStack w="full" p={2}>
        <StackDivider borderWidth={1} borderColor="blue.400" rounded="full" />
        <VStack spacing={0} align="flex-start">
          <Text fontSize="md">{format(train.departAt, 'HH:mm')}</Text>
          <Text textStyle="description" fontSize="2xs">
            {train.destination}行
          </Text>
        </VStack>
        <Spacer />
        <Text textStyle="title">
          {formatTimeDifference(train.departAt, date)}
        </Text>
      </HStack>
    ) : (
      <Center w="full" py={2}>
        <Text textStyle="description" fontWeight="bold">
          次の電車はありません
        </Text>
      </Center>
    ),
);

export default UpcomingTrains;
