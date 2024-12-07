import React from 'react';
import {
  Box,
  Collapse,
  Heading,
  HStack,
  Icon,
  LinkBox,
  Skeleton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight } from 'react-icons/tb';
import { useSeconds } from 'use-seconds';
import { useDiainfo, useTransitTimetable } from '@/services/transit';
import StatusAlert from '../transit/StatusAlert';
import Error from './Error';
import {
  PrimaryUpcomingTrainCountdown,
  SecondoryUpcomingTrainCountdown,
} from '../transit/Upcoming';
import { dayNumberToString, formatTimeStringToDate } from '@/utils/transit';

export default function Transit() {
  // const { data, isPending } = useTransit();
  const { data: diaInfo, status, error } = useDiainfo();

  return (
    <VStack spacing={4} w="100%" align="flex-start">
      <LinkBox w="100%" as={RouterLink} to="/transit">
        <HStack pt={2} pl={2} w="100%">
          <Heading as="h2" size="md">
            交通情報
          </Heading>
          <Spacer />
          <Text textStyle="description" color="description" fontWeight="bold">
            Yahoo! 路線情報提供
          </Text>
          <Icon as={TbChevronRight} boxSize={5} />
        </HStack>
      </LinkBox>
      <VStack p={2} align="flex-start" w="100%">
        {status === 'error' ? (
          <Error error={error} />
        ) : (
          <Skeleton w="full" rounded="xl" isLoaded={status !== 'pending'}>
            <StatusAlert lines={diaInfo} />
          </Skeleton>
        )}
        <Text textStyle="title" fontSize="lg">
          長野方面
        </Text>
        <UpcomingTrainsStack dest="nagano" />
        <Text textStyle="title" fontSize="lg">
          上田方面
        </Text>
        <UpcomingTrainsStack dest="ueda" />
      </VStack>
    </VStack>
  );
}

function UpcomingTrainsStack({ dest }: { dest: 'nagano' | 'ueda' }) {
  const { isOpen, onToggle } = useDisclosure();
  const [date] = useSeconds();
  const day = dayNumberToString(date.getDay());

  const { data, isPending } = useTransitTimetable({
    dest,
    kind: day,
  });

  const upcoming = data
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
    <Skeleton w="full" rounded="xl" isLoaded={!isPending}>
      <VStack spacing={0} layerStyle="button" rounded="xl">
        <PrimaryUpcomingTrainCountdown
          date={date}
          train={upcoming?.[0]}
          onClick={onToggle}
        />
        <Box w="full">
          <Collapse in={isOpen}>
            {(upcoming?.length ?? 0) > 2 && (
              <Stack
                flexDirection={{ base: 'column', md: 'row' }}
                spacing={{ base: 0, md: 2 }}
                w="full"
              >
                <SecondoryUpcomingTrainCountdown
                  date={date}
                  train={upcoming?.[1]}
                />
                <SecondoryUpcomingTrainCountdown
                  date={date}
                  train={upcoming?.[2]}
                />
              </Stack>
            )}
          </Collapse>
        </Box>
      </VStack>
    </Skeleton>
  );
}
