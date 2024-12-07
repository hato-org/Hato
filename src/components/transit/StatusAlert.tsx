import React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Collapse,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import {
  TbAlertTriangle,
  TbChevronDown,
  TbChevronRight,
  TbCircle,
  TbHelpCircle,
  TbX,
} from 'react-icons/tb';
import { format } from 'date-fns/esm';

const StatusAlert = React.memo(
  ({
    lines,
    defaultOpen,
    filterUnstableLines,
  }: {
    lines?: DiaInfo[];
    defaultOpen?: boolean;
    filterUnstableLines?: boolean;
  }) => {
    const statusSummary = lines?.every(({ status }) => status.code !== 'normal')
      ? 'error'
      : lines?.some(({ status }) => status.code !== 'normal')
        ? 'warning'
        : 'success';

    const { isOpen, onToggle } = useDisclosure({
      defaultIsOpen: defaultOpen ?? statusSummary !== 'success',
    });

    return (
      <Alert
        // bg='transparent'
        status={statusSummary}
        rounded="xl"
        p={0}
        _hover={{ cursor: 'pointer' }}
      >
        <VStack w="full" spacing={0}>
          <HStack
            w="full"
            px={4}
            py={{ base: 3, md: 4 }}
            onClick={onToggle}
            layerStyle="button"
          >
            <AlertIcon mr={0} />
            <Text textStyle="title">
              {statusSummary === 'error'
                ? '大規模な障害あり'
                : statusSummary === 'warning'
                  ? '一部路線に情報あり'
                  : '全路線平常運転'}
            </Text>
            <Spacer />
            <Icon
              as={TbChevronDown}
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="all .2s ease"
            />
          </HStack>
          <Box w="full">
            <Collapse in={isOpen}>
              <VStack
                p={{ base: 2, md: 4 }}
                spacing={0}
                w="full"
                align="flex-start"
              >
                {lines
                  ?.toSorted((a, b) =>
                    a.status.code !== 'normal'
                      ? -1
                      : b.status.code !== 'normal'
                        ? 1
                        : 0,
                  )
                  .filter(({ status }) =>
                    filterUnstableLines ? status.code !== 'normal' : true,
                  )
                  .map((diaInfo) => (
                    <LineInfo key={diaInfo.lineInfo.kana} diaInfo={diaInfo} />
                  ))}
              </VStack>
            </Collapse>
          </Box>
        </VStack>
      </Alert>
    );
  },
);

const LineInfo = React.memo(({ diaInfo }: { diaInfo: DiaInfo }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const borderColor = (() => {
    switch (diaInfo.status.code) {
      case 'suspend':
        return 'red.400';
      case 'trouble':
        return 'yellow.400';
      case 'normal':
        return 'green.400';
      default:
        return 'blue.400';
    }
  })();

  return (
    <HStack w="full" layerStyle="button" p={2} rounded="lg" onClick={onOpen}>
      <StackDivider borderWidth={2} borderColor={borderColor} rounded="full" />
      <Text textStyle="title">{diaInfo.lineInfo.name}</Text>
      <Spacer />
      <Text textStyle="description" fontWeight="bold" noOfLines={1}>
        {diaInfo.status.text}
      </Text>
      <Icon as={TbChevronRight} />
      <StatusDetailModal isOpen={isOpen} onClose={onClose} diaInfo={diaInfo} />
    </HStack>
  );
});

const StatusDetailModal = React.memo(
  ({
    isOpen,
    onClose,
    diaInfo,
  }: {
    isOpen: boolean;
    onClose: () => void;
    diaInfo: DiaInfo;
  }) => {
    const statusIcon = (() => {
      switch (diaInfo.status.code) {
        case 'suspend':
          return { icon: TbX, color: 'error' };

        case 'trouble':
          return { icon: TbAlertTriangle, color: 'warning' };

        case 'normal':
          return { icon: TbCircle, color: 'success' };

        default:
          return { icon: TbHelpCircle, color: 'info' };
      }
    })();

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl" bg="panel">
          <ModalCloseButton top={4} right={4} />
          <ModalHeader>{diaInfo.lineInfo.name}</ModalHeader>
          <ModalBody>
            <VStack spacing={4} px={2}>
              <VStack>
                <Icon
                  color={statusIcon.color}
                  as={statusIcon.icon}
                  boxSize={24}
                />
                <Text textStyle="title" fontSize="xl">
                  {diaInfo.status.text}
                </Text>
              </VStack>
              <Text textStyle='description'>{diaInfo.description}</Text>
              <Text alignSelf='flex-end' textStyle='description'>
                {format(new Date(diaInfo.updatedAt), 'MM/dd HH:mm')} 更新
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    );
  },
);

export default StatusAlert;
