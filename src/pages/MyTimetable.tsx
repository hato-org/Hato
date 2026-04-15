import {
  Center,
  HStack,
  Heading,
  Box,
  Portal,
  Button,
  Icon,
  VStack,
  StackDivider,
  Spacer,
  IconButton,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { TbPlus } from 'react-icons/tb';
import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import { useMyUserSchedules } from '@/services/timetable';
import Card from '@/components/timetable/editor/Card';
import UserScheduleEditor from '@/components/timetable/editor/UserScheduleEditor';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import { useUser } from '@/services/user';
import { userScheduleEditorAtom } from '@/store/overlay';
import { queryKeys } from '@/services/queryKeys';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';
import { UserScheduleSearch } from '@/components/timetable/editor/UserScheduleSearch';

function MyTimetable() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const setUserScheduleEditor = useSetAtom(userScheduleEditorAtom);

  const { data, isPending, error } = useMyUserSchedules();

  return (
    <Box>
      <Helmet>
        <title>マイ時間割 - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" py={4}>
            マイ時間割
          </Heading>
        </HStack>
      </Header>
      <Portal>
        <UserScheduleEditor />
      </Portal>
      <ChakraPullToRefresh
        onRefresh={async () => {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.timetable.myUserSchedules(user._id),
          });
        }}
      >
        <Center mb={32} pt={4} px={4} flexDir="column">
          <VStack align="flex-start" w="full" gap={4}>
            <UserScheduleSearch />
            <StackDivider border="1px solid" borderColor="border" />
            <HStack px={4} w="full">
              <Heading as="h3" size="md">
                作成・インポートした時間割
              </Heading>
              <Spacer />
              <IconButton
                aria-label="Add new user schedule"
                icon={<Icon as={TbPlus} />}
                variant="ghost"
                colorScheme="blue"
                isRound
                onClick={() => setUserScheduleEditor('new')}
              />
            </HStack>
            {isPending ? (
              <Loading />
            ) : error ? (
              <Error error={error} />
            ) : (
              data?.map((userSchedule) => (
                <Card key={userSchedule._id} {...userSchedule} />
              ))
            )}
            <Button
              w="full"
              rounded="lg"
              variant="ghost"
              colorScheme="blue"
              leftIcon={<Icon as={TbPlus} />}
              onClick={() => setUserScheduleEditor('new')}
            >
              新しい時間割を作成
            </Button>
          </VStack>
        </Center>
      </ChakraPullToRefresh>
    </Box>
  );
}

export default MyTimetable;
