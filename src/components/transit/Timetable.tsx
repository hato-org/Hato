import {
  Box,
  HStack,
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

export const TrainTimetableModal = React.memo(
  ({
    starting,
    destination,
    stations,
    isOpen,
    onClose,
  }: TransitTimetable & { isOpen: boolean; onClose: () => void }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent rounded="xl" bg="panel">
        <ModalCloseButton top={4} right={4} />
        <ModalHeader>
          {starting} to {destination}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={0}>
            {stations.map((station) => (
              <Station {...station} />
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  ),
);

const Station = React.memo(({ name, arriveAt, departAt }: TransitTimetable) => (
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
    {/* <AnimatePresence>
          <motion.div
            style={{
              display: isPlaying ? 'block' : 'none',
              position: 'absolute',
              borderRadius: '100%',
              width: 'var(--chakra-sizes-3)',
              height: 'var(--chakra-sizes-3)',
              backgroundColor: isPlaying
                ? 'var(--chakra-colors-blue-400)'
                : 'var(--chakra-colors-border)',
              boxShadow: 'var(--chakra-shadow-sm)',
              left: 'var(--chakra-sizes-2)',
              scale: 1,
              opacity: 1,
            }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </AnimatePresence> */}
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
        <Text textStyle="title" fontSize="xl" color="title">
          {departAt}{' '}
          <Text as="span" fontSize="sm">
            発
          </Text>
        </Text>
      )}
    </VStack>
    {/* <Spacer /> */}
    <VStack align="flex-end" spacing={0}>
      <Text textStyle="title" fontSize="xl">
        {name}
      </Text>
      {/* <Text textStyle="description" fontWeight="bold">
            {location}
          </Text> */}
    </VStack>
    {/* <Icon as={sportIcon[id]} boxSize={8} /> */}
  </HStack>
));
