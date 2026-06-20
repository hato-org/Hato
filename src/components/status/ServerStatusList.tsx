import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Collapsible,
  HStack,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StackSeparator,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useHatoStatusHistory } from '@/services/status';

const ServerStatusList = React.memo(({ status }: { status?: Status }) => (
  <VStack w="full">
    {status?.status.map((serverStatus) => (
      <ServerStatus key={serverStatus.id} {...serverStatus} />
    ))}
  </VStack>
));
ServerStatusList.displayName = 'ServerStatusList';

const ServerStatus = React.memo(({ id, name, ok }: StatusServerInfo) => {
  const { open: isOpen, onToggle } = useDisclosure();

  return (
    <VStack w="full" gap={0} rounded="xl" layerStyle="button">
      <HStack w="full" p={2} gap={4} onClick={onToggle}>
        <StackSeparator
          rounded="full"
          borderWidth={2}
          borderColor={ok ? 'success' : 'error'}
        />
        <VStack align="flex-start" gap={1}>
          <Heading as="h3" textStyle="title" fontSize="xl">
            {name}
          </Heading>
          <Text textStyle="description">{ok ? '正常稼働中' : '異常発生'}</Text>
        </VStack>
      </HStack>
      <Box w="full">
        <Collapsible.Root open={isOpen}><Collapsible.Content>
          <VStack w="full" p={2} align="flex-start" gap={4}>
            <Alert
              status={ok ? 'success' : 'error'}
              rounded="lg"
              justifyContent="center"
            >
              <AlertIcon />
              <AlertTitle>{ok ? '正常稼働中' : '異常発生'}</AlertTitle>
            </Alert>

            <ServerStatusHistoryStack id={id} />
          </VStack>
        </Collapsible.Content></Collapsible.Root>
      </Box>
    </VStack>
  );
});
ServerStatus.displayName = 'ServerStatus';

const ServerStatusHistoryStack = React.memo(({ id }: { id: string }) => {
  const { data } = useHatoStatusHistory({ id });

  return (
    <VStack w="full" align="flex-start">
      <Heading as="h4" size="sm">
        直近24時間の稼働状況
      </Heading>
      <HStack w="full" gap={1} flexDir="row-reverse">
        {data?.pages
          .flat()
          .map(({ ok, status, statusText, responseTime, timestamp }) => (
            <Popover key={timestamp} trigger="hover">
              <PopoverTrigger>
                <Box
                  w="full"
                  h={8}
                  rounded="sm"
                  bg={ok ? 'success' : 'error'}
                  _hover={{ bg: ok ? 'green.300' : 'red.400' }}
                  transition="all .2s ease"
                />
              </PopoverTrigger>
              <PopoverContent borderColor="border" bg="panel" rounded="2xl">
                <PopoverArrow bg="panel" />
                <PopoverBody p={6}>
                  <VStack gap={4}>
                    <Text textStyle="title" fontSize="xl">
                      {format(new Date(timestamp), 'MM/dd H:mm')}
                    </Text>
                    <Alert
                      status={ok ? 'success' : 'error'}
                      rounded="lg"
                      justifyContent="center"
                    >
                      <AlertIcon />
                      <AlertTitle>{ok ? '正常稼働' : '異常発生'}</AlertTitle>
                    </Alert>
                    <HStack w="full" justify="space-between">
                      <Text textStyle="description" fontWeight="bold">
                        HTTPステータス
                      </Text>
                      <Text textStyle="title">
                        {status} {statusText}
                      </Text>
                    </HStack>
                    <HStack w="full" justify="space-between">
                      <Text textStyle="description" fontWeight="bold">
                        応答時間
                      </Text>
                      <Text textStyle="title">{responseTime}ms</Text>
                    </HStack>
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ))}
      </HStack>
      <HStack w="full" justify="space-between">
        <Text textStyle="description" fontSize="xs" fontWeight="bold">
          24時間前
        </Text>
        <Text textStyle="description" fontSize="xs" fontWeight="bold">
          現在
        </Text>
      </HStack>
    </VStack>
  );
});
ServerStatusHistoryStack.displayName = 'ServerStatusHistoryStack';

export default ServerStatusList;
