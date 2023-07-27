import {
  HStack,
  Heading,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns/esm';
import { TbPlus } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import Card from '@/components/layout/Card';
import { useHatoStatus, useHatoStatusMaintenance } from '@/hooks/status';
import ServerStatusList from '@/components/status/ServerStatusList';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import StatusInfoList from '@/components/status/StatusInfoList';
import AddStatusInfo from '@/components/status/AddStatusInfo';
import { useUser } from '@/hooks/user';

function Status() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const { data: status } = useHatoStatus();
  const { data: statusInfo } = useHatoStatusMaintenance();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Helmet>
        <title>稼働状況 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="full">
          <Heading size="md" ml={2} py={4}>
            稼働状況
          </Heading>
        </HStack>
      </Header>
      <ChakraPullToRefresh
        onRefresh={async () => {
          await queryClient.invalidateQueries(['status']);
        }}
      >
        <VStack w="full" p={4} spacing={8}>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={4}>
              <HStack w="full">
                <Heading size="md">リアルタイム稼働状況</Heading>
                <Spacer />
                <Text textStyle="title" color="description">
                  {status
                    ? format(new Date(status.updatedAt), 'HH:mm 現在')
                    : ''}
                </Text>
              </HStack>
              <ServerStatusList status={status} />
            </VStack>
          </Card>
          <Card w="full">
            <VStack align="flex-start" w="full" p={2} spacing={4}>
              <HStack w="full">
                <Heading size="md">メンテナンス情報</Heading>
                <Spacer />
                {user.role === 'admin' && (
                  <IconButton
                    aria-label="Add maintenance info"
                    icon={<Icon as={TbPlus} />}
                    onClick={onOpen}
                    variant="ghost"
                    colorScheme="blue"
                    isRound
                  />
                )}
              </HStack>
              <StatusInfoList statusInfo={statusInfo} />
            </VStack>
          </Card>
        </VStack>
      </ChakraPullToRefresh>
      <AddStatusInfo isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Status;
