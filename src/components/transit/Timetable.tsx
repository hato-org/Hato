import {
  Box,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

export const TrainTimetableModal = React.memo(
  ({
    starting,
    destination,
    stations,
    isOpen,
    onClose,
  }: TransitTimetable & { isOpen: boolean; onClose: () => void }) => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent rounded="xl" bg="panel">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>時刻表の詳細</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <VStack w="full" align="flex-start" spacing={2}>
              <Text textStyle="description">列車詳細</Text>
              <HStack w='full' justify='space-evenly'>
                <VStack spacing={0}>
                  <Text fontSize="2xl" lineHeight={1}>{starting}</Text>
                  <Text fontSize='lg'>{stations[0].departAt}{' '}
                    <Text as="span" fontSize="xs">
                      発
                    </Text>
                  </Text>
                </VStack>
                <Icon as={TbChevronRight} boxSize={6} />
                <VStack spacing={0}>
                  <Text fontSize="2xl" lineHeight={1}>{destination}</Text>
                  <Text fontSize='lg'>{stations.at(-1)?.arriveAt}{' '}
                    <Text as="span" fontSize="xs">
                      着
                    </Text>
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <VStack w="full" align="flex-start" spacing={0}>
              <Text textStyle="description">各駅発着時刻</Text>
              <VStack w="full" spacing={0}>
                {stations.map((station) => (
                  <Station {...station} />
                ))}
              </VStack>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  ),
);

const Station = React.memo(
  ({ name, arriveAt, departAt }: TransitTimetableStation) => (
    // const date = new Date();

    <HStack
      pos="relative"
      w="full"
      p={2}
      py={2}
      spacing={4}
      _first={{
        _after: {
          content: '""',
          pos: 'absolute',
          bg: 'blue.400',
          left: 3,
          top: 'calc(50% + var(--chakra-sizes-4))',
          bottom: 0,
          w: 1,
          shadow: 'lg',
          roundedTop: 'full',
        },
      }}
      _notFirst={{
        _before: {
          content: '""',
          pos: 'absolute',
          bg: 'blue.400',
          left: 3,
          bottom: 'calc(50% + var(--chakra-sizes-4))',
          top: 0,
          w: 1,
          shadow: 'lg',
          roundedBottom: 'full',
        },
        _after: {
          content: '""',
          pos: 'absolute',
          bg: 'blue.400',
          left: 3,
          top: 'calc(50% + var(--chakra-sizes-4))',
          bottom: 0,
          w: 1,
          shadow: 'lg',
          roundedTop: 'full',
        },
      }}
      _last={{
        _before: {
          content: '""',
          pos: 'absolute',
          bg: 'blue.400',
          left: 3,
          bottom: 'calc(50% + var(--chakra-sizes-4))',
          top: 0,
          w: 1,
          shadow: 'lg',
        },
        _after: {
          display: 'none',
        },
      }}
      // border='1px solid'
      // borderColor='border'
    >
      <Box
        pos="absolute"
        rounded="full"
        boxSize={3}
        bg="blue.400"
        shadow="sm"
        left={2}
      />
      <VStack minW={28} pl={6} spacing={0} align="flex-start">
        {arriveAt && (
          <Text textStyle="title" fontSize="sm" color="description">
            {arriveAt}{' '}
            <Text as="span" fontSize="xs">
              着
            </Text>
          </Text>
        )}
        {departAt && (
          <Text lineHeight={.9} textStyle="title" fontSize="lg" color="title">
            {departAt}{' '}
            <Text as="span" fontSize="sm">
              発
            </Text>
          </Text>
        )}
      </VStack>
      <VStack align="flex-end" spacing={0}>
        <Text textStyle="title" fontSize="xl">
          {name}
        </Text>
      </VStack>
    </HStack>
  ),
);
