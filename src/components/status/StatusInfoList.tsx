import React from 'react';
import {
  Box,
  Collapsible,
  HStack,
  Heading,
  Icon,
  Spacer,
  StackSeparator,
  Text,
  VStack,
  Wrap,
  useDisclosure,
} from '@chakra-ui/react';
import { Tag } from '@/components/ui/tag';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
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
StatusInfoList.displayName = 'StatusInfoList';

const StatusInfo = React.memo(
  ({ title, description, startAt, endAt, scope }: StatusMaintenance) => {
    const { open: isOpen, onToggle } = useDisclosure();
    const { data } = useHatoStatusServerList();

    return (
      <VStack
        w="full"
        rounded="xl"
        layerStyle="button"
        gap={0}
        p={2}
        borderColor={isOpen ? 'border' : undefined}
      >
        <HStack w="full" gap={4} onClick={onToggle}>
          <VStack gap={0} align="flex-end">
            <Text textStyle="title" fontSize="md">
              {format(new Date(startAt), 'MM/dd')}
            </Text>
            <Text textStyle="description">
              {format(new Date(startAt), 'H:mm')}
            </Text>
          </VStack>
          <StackSeparator borderWidth={1} borderColor="blue.400" rounded="full" />
          <VStack align="flex-start" gap={1}>
            <Text textStyle="title">{title}</Text>
            <Wrap>
              {scope.map((serverId) => (
                <Tag key={serverId} size="sm">
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
          <Collapsible.Root open={isOpen}><Collapsible.Content>
            <VStack w="full" pt={6} gap={4}>
              <HStack w="full" justify="space-evenly">
                <VStack align="flex-start" gap={0}>
                  <Text textStyle="title" fontSize="xs">
                    {format(new Date(startAt), 'MMMdo (ccc)', { locale: ja })}
                  </Text>
                  <Text textStyle="title" fontSize="xl">
                    {format(new Date(startAt), 'HH:mm', { locale: ja })}
                  </Text>
                </VStack>
                <Icon as={TbChevronRight} color="description" boxSize={6} />
                <VStack align="flex-start" gap={0}>
                  <Text textStyle="title" fontSize="xs">
                    {format(new Date(endAt), 'MMMdo (ccc)', { locale: ja })}
                  </Text>
                  <Text textStyle="title" fontSize="xl">
                    {format(new Date(endAt), 'HH:mm', { locale: ja })}
                  </Text>
                </VStack>
              </HStack>
              <HStack w="full" align="flex-start" gap={6} px={2}>
                <Heading flexShrink={0} size="sm">
                  説明
                </Heading>
                <Text textStyle="description">{description}</Text>
              </HStack>
            </VStack>
          </Collapsible.Content></Collapsible.Root>
        </Box>
      </VStack>
    );
  },
);
StatusInfo.displayName = 'StatusInfo';

export default StatusInfoList;
