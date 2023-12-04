import React from 'react';
import {
  Box,
  Collapse,
  HStack,
  Heading,
  Icon,
  Spacer,
  StackDivider,
  Tag,
  Text,
  VStack,
  Wrap,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns/esm';
import { ja } from 'date-fns/esm/locale';
import { TbChevronDown, TbChevronRight } from 'react-icons/tb';
import { useHatoStatusServerList } from '@/services/status';

const StatusInfoList = React.memo(
  ({ statusInfo }: { statusInfo?: StatusMaintenance[] }) =>
    statusInfo?.length ? (
      <VStack w="full">
        {statusInfo.map((info) => (
          <StatusInfo key={info.title} {...info} />
        ))}
      </VStack>
    ) : (
      <Text
        w="full"
        py={2}
        textAlign="center"
        textStyle="description"
        fontWeight="bold"
      >
        メンテナンス情報はありません
      </Text>
    ),
);

const StatusInfo = React.memo(
  ({ title, description, startAt, endAt, scope }: StatusMaintenance) => {
    const { isOpen, onToggle } = useDisclosure();
    const { data } = useHatoStatusServerList();

    return (
      <VStack
        w="full"
        rounded="xl"
        layerStyle="button"
        spacing={0}
        p={2}
        borderColor={isOpen ? 'border' : undefined}
      >
        <HStack w="full" spacing={4} onClick={onToggle}>
          <VStack spacing={0} align="flex-end">
            <Text textStyle="title" fontSize="md">
              {format(new Date(startAt), 'MM/dd')}
            </Text>
            <Text textStyle="description">
              {format(new Date(startAt), 'H:mm')}
            </Text>
          </VStack>
          <StackDivider borderWidth={1} borderColor="blue.400" rounded="full" />
          <VStack align="flex-start" spacing={1}>
            <Text textStyle="title">{title}</Text>
            <Wrap>
              {scope.map((serverId) => (
                <Tag size="sm">
                  {data?.find(({ id }) => id === serverId)?.name}
                </Tag>
              ))}
            </Wrap>
          </VStack>
          <Spacer />
          <Icon
            as={TbChevronDown}
            transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            transition="all .2s ease"
          />
        </HStack>
        <Box w="full">
          <Collapse in={isOpen}>
            <VStack w="full" pt={6} spacing={4}>
              <HStack w="full" justify="space-evenly">
                <VStack align="flex-start" spacing={0}>
                  <Text textStyle="title" fontSize="xs">
                    {format(new Date(startAt), 'MMMdo (ccc)', { locale: ja })}
                  </Text>
                  <Text textStyle="title" fontSize="xl">
                    {format(new Date(startAt), 'HH:mm', { locale: ja })}
                  </Text>
                </VStack>
                <Icon as={TbChevronRight} color="description" boxSize={6} />
                <VStack align="flex-start" spacing={0}>
                  <Text textStyle="title" fontSize="xs">
                    {format(new Date(endAt), 'MMMdo (ccc)', { locale: ja })}
                  </Text>
                  <Text textStyle="title" fontSize="xl">
                    {format(new Date(endAt), 'HH:mm', { locale: ja })}
                  </Text>
                </VStack>
              </HStack>
              <HStack w="full" align="flex-start" spacing={6} px={2}>
                <Heading flexShrink={0} size="sm">
                  説明
                </Heading>
                <Text textStyle="description">{description}</Text>
              </HStack>
            </VStack>
          </Collapse>
        </Box>
      </VStack>
    );
  },
);

export default StatusInfoList;
