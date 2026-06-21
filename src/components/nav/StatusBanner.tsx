import { useMemo } from 'react';
import { Box, Collapsible, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router';
import {
  TbAlertTriangle,
  TbChevronRight,
  TbCloudOff,
  TbTool,
} from 'react-icons/tb';
import { useHatoStatus, useHatoStatusMaintenance } from '@/services/status';
import { useIsOnline } from '@/hooks/common/online';

export default function StatusBanner() {
  const { data: status } = useHatoStatus();
  const { data: statusInfo } = useHatoStatusMaintenance();

  const isOnline = useIsOnline();
  const isInMaintenance = statusInfo?.some(
    ({ startAt, endAt }) =>
      new Date(startAt).getTime() < Date.now() &&
      Date.now() < new Date(endAt).getTime(),
  );
  const isDown = useMemo(
    () => status?.status.some(({ ok }) => !ok) && !isInMaintenance,
    [status, isInMaintenance],
  );

  return (
    <VStack w="full" gap={0}>
      <Box w="full">
        <Collapsible.Root open={!!statusInfo?.length}><Collapsible.Content>
          <HStack
            w="full"
            justify="center"
            py={2}
            bg="warning"
            asChild
            color="white"
          >
            <RouterLink to="/status">
              <Icon as={TbTool} boxSize={6} />
              <Text textStyle="title" color="inherit">
                メンテナンス情報あり
              </Text>
              <Icon as={TbChevronRight} />
            </RouterLink>
          </HStack>
        </Collapsible.Content></Collapsible.Root>
      </Box>
      <Box w="full">
        <Collapsible.Root open={isInMaintenance}><Collapsible.Content>
          <HStack
            w="full"
            justify="center"
            py={2}
            bg="error"
            asChild
            color="white"
          >
            <RouterLink to="/status">
              <Icon as={TbAlertTriangle} boxSize={6} />
              <Text textStyle="title" color="inherit">
                メンテナンス中
              </Text>
              <Icon as={TbChevronRight} />
            </RouterLink>
          </HStack>
        </Collapsible.Content></Collapsible.Root>
      </Box>
      <Box w="full">
        <Collapsible.Root open={isDown}><Collapsible.Content>
          <HStack
            w="full"
            justify="center"
            py={2}
            bg="error"
            asChild
            color="white"
          >
            <RouterLink to="/status">
              <Icon as={TbAlertTriangle} boxSize={6} />
              <Text textStyle="title" color="inherit">
                障害発生中
              </Text>
              <Icon as={TbChevronRight} />
            </RouterLink>
          </HStack>
        </Collapsible.Content></Collapsible.Root>
      </Box>
      <Box w="full">
        <Collapsible.Root open={!isOnline}><Collapsible.Content>
          <HStack w="full" justify="center" py={1} bg="bg.500" color="white">
            <Icon as={TbCloudOff} boxSize={6} />
            <Text textStyle="title" color="inherit">
              オフライン
            </Text>
          </HStack>
        </Collapsible.Content></Collapsible.Root>
      </Box>
    </VStack>
  );
}
