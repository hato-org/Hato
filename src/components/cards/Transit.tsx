import React from 'react';
import {
  Heading,
  HStack,
  Icon,
  LinkBox,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight } from 'react-icons/tb';
import { useDiainfo } from '@/services/transit';
import StatusAlert from '../transit/StatusAlert';
import Error from './Error';

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
        {/* <Skeleton w="100%" rounded="xl" isLoaded={!isPending}>
          <TransitButton transits={data?.nagano} />
        </Skeleton>
        <Text textStyle="title" fontSize="lg">
          上田方面
        </Text>
        <Skeleton w="100%" rounded="xl" isLoaded={!isPending}>
          <TransitButton transits={data?.ueda} />
        </Skeleton> */}
      </VStack>
    </VStack>
  );
}
