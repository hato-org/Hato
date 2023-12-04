import {
  Center,
  HStack,
  Heading,
  Box,
  Portal,
  Button,
  Icon,
  VStack,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { TbPlus } from 'react-icons/tb';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/nav/Header';
import BackButton from '@/components/layout/BackButton';
import { useMyUserSchedules } from '@/services/timetable';
import Card from '@/components/timetable/editor/Card';
import UserScheduleEditor from '@/components/timetable/UserScheduleEditor';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import { useUser } from '@/services/user';
import { overlayAtom } from '@/store/overlay';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';

function MyTimetable() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const setOverlay = useSetRecoilState(overlayAtom);

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
            queryKey: ['timetable', 'userschedule', 'user', user._id],
          });
        }}
      >
        <Center mb={32} pt={4} px={4} flexDir="column">
          <VStack w="full" spacing={6}>
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
              colorScheme="blue"
              leftIcon={<Icon as={TbPlus} />}
              onClick={() =>
                setOverlay((currVal) => ({
                  ...currVal,
                  userScheduleEditor: 'new',
                }))
              }
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
