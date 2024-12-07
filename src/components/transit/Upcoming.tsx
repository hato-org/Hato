import React from 'react';
import {
  Center,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  Stack,
  StackDivider,
  StackProps,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { TbChevronRight } from 'react-icons/tb';
import { useSeconds } from 'use-seconds';
import { format } from 'date-fns/esm';
import Card from '../layout/Card';
import { useTransitTimetable } from '@/services/transit';
import { TrainTimetableModal } from './Timetable';
import { dayNumberToString, formatTimeDifference, formatTimeStringToDate } from '@/utils/transit';

type UpcomingTrain = TransitTimetable & {
  name?: string;
  arriveAt: Date;
  departAt: Date;
};

const UpcomingTrains = React.memo(() => {
  const [date] = useSeconds();
  const day = dayNumberToString(date.getDay());

  const { data: nagano, isPending: isNaganoPending } = useTransitTimetable({
    dest: 'nagano',
    kind: day,
  });

  const { data: ueda, isPending: isUedaPending } = useTransitTimetable({
    dest: 'ueda',
    kind: day,
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
        <VStack align="flex-start" w="100%">
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
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: 0, md: 2 }}
                  w="full"
                >
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={naganoUpcoming?.[1]}
                    openModal
                  />
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={naganoUpcoming?.[2]}
                    openModal
                  />
                </Stack>
              )}
            </Skeleton>
          </VStack>
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
                <Stack
                  flexDirection={{ base: 'column', md: 'row' }}
                  spacing={{ base: 0, md: 2 }}
                  w="full"
                >
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={uedaUpcoming?.[1]}
                    openModal
                  />
                  <SecondoryUpcomingTrainCountdown
                    date={date}
                    train={uedaUpcoming?.[2]}
                    openModal
                  />
                </Stack>
              )}
            </Skeleton>
          </VStack>
        </VStack>
      </VStack>
    </Card>
  );
});

export const PrimaryUpcomingTrainCountdown = React.memo(
  ({
    date,
    train,
    openModal,
    ...rest
  }: StackProps & {
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
          {...rest}
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
          {openModal && <Icon as={TbChevronRight} />}
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
export const SecondoryUpcomingTrainCountdown = React.memo(
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
          pl={{ base: 4, md: 2 }}
          rounded="xl"
          onClick={onOpen}
          layerStyle={openModal ? 'button' : undefined}
        >
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
          {openModal && <Icon as={TbChevronRight} />}
        </HStack>
        {openModal && (
          <TrainTimetableModal {...train} isOpen={isOpen} onClose={onClose} />
        )}
      </>
    ) : (
      <Center w="full" py={2}>
        <Text textStyle="description" fontWeight="bold">
          次の電車はありません
        </Text>
      </Center>
    );
  },
);

export default UpcomingTrains;
