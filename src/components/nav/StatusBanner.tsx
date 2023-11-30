import { useMemo } from 'react';
import { Box, Collapse, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TbAlertTriangle,
  TbChevronRight,
  TbCloudOff,
  TbTool,
} from 'react-icons/tb';
import { useHatoStatus, useHatoStatusMaintenance } from '@/hooks/status';
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
    <VStack w="full" spacing={0}>
      <Box w="full">
        <Collapse in={!!statusInfo?.length}>
          <HStack
            w="full"
            justify="center"
            py={2}
            bg="warning"
            as={RouterLink}
            to="/status"
            color="white"
          >
            <Icon as={TbTool} boxSize={6} />
            <Text textStyle="title" color="inherit">
              メンテナンス情報あり
            </Text>
            <Icon as={TbChevronRight} />
          </HStack>
        </Collapse>
      </Box>
      <Box w="full">
        <Collapse in={isInMaintenance}>
          <HStack
            w="full"
            justify="center"
            py={2}
            bg="error"
            as={RouterLink}
            to="/status"
            color="white"
          >
            <Icon as={TbAlertTriangle} boxSize={6} />
            <Text textStyle="title" color="inherit">
              メンテナンス中
            </Text>
            <Icon as={TbChevronRight} />
          </HStack>
        </Collapse>
      </Box>
      <Box w="full">
        <Collapse in={isDown}>
          <HStack
            w="full"
            justify="center"
            py={2}
            bg="error"
            as={RouterLink}
            to="/status"
            color="white"
          >
            <Icon as={TbAlertTriangle} boxSize={6} />
            <Text textStyle="title" color="inherit">
              障害発生中
            </Text>
            <Icon as={TbChevronRight} />
          </HStack>
        </Collapse>
      </Box>
      <Box w="full">
        <Collapse in={!isOnline}>
          <HStack w="full" justify="center" py={1} bg="bg.500" color="white">
            <Icon as={TbCloudOff} boxSize={6} />
            <Text textStyle="title" color="inherit">
              オフライン
            </Text>
          </HStack>
        </Collapse>
      </Box>
    </VStack>
  );
}
