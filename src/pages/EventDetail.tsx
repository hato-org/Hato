import {
  Heading,
  HStack,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  useDisclosure,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
  Center,
  Spacer,
  Box,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { TbDots, TbEdit, TbTrash, TbFlag } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { eachMonthOfInterval } from 'date-fns/esm';
import BottomNavbar from '@/components/nav/BottomNavbar';
import Header from '@/components/nav/Header';
import { useClient } from '@/modules/client';
import Error from '@/components/cards/Error';
import Event from '@/components/calendar/Event';
import BackButton from '@/components/layout/BackButton';
import { useUser } from '@/hooks/user';
import ReportModal from '@/components/common/ReportModal';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });

  const {
    isOpen: deleteOpen,
    onClose: deleteOnClose,
    onOpen: deleteOnOpen,
  } = useDisclosure();
  const {
    isOpen: reportOpen,
    onClose: reportOnClose,
    onOpen: reportOnOpen,
  } = useDisclosure();
  const cancelRef = useRef<any>();

  const { data: user } = useUser();
  const { client } = useClient();
  const queryClient = useQueryClient();

  const { data, error } = useQuery<Event, AxiosError>(
    ['calendar', 'event', id],
    async () => (await client.get(`/calendar/event/${id}`)).data
  );

  const { mutate: deleteSubmit, isLoading: deleteLoading } = useMutation<
    AxiosResponse<any>,
    AxiosError
  >(() => client.delete(`/calendar/event/${data?._id}`), {
    onSuccess: () => {
      toast({
        title: 'イベントを削除しました。',
        status: 'success',
      });
      queryClient.removeQueries(['calendar', 'event', data?._id]);

      const monthRange = eachMonthOfInterval({
        start: new Date(data?.startAt ?? Date.now()),
        end: new Date(data?.endAt ?? Date.now()),
      });

      monthRange.forEach((month) => {
        queryClient.setQueryData<Event[]>(
          [
            'calendar',
            'events',
            { month: month.getMonth() + 1, year: month.getFullYear() },
          ],
          (oldEvents) =>
            oldEvents?.filter((oldEvent) => oldEvent._id !== data?._id)
        );
      });

      deleteOnClose();
      navigate(-1);
    },
    onError: (mutationError) => {
      toast({
        title: 'イベントの削除に失敗しました。',
        description: mutationError.message,
        status: 'error',
      });
      deleteOnClose();
    },
  });

  if (error) return <Error error={error} />;

  return (
    <>
      <Helmet>
        <title>
          {data?.title ?? 'イベントの詳細'} - {import.meta.env.VITE_APP_NAME}
        </title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" py={4}>
            イベントの詳細
          </Heading>
          <Spacer />
          <Box>
            <Menu>
              <MenuButton
                as={IconButton}
                variant="ghost"
                size="lg"
                aria-label="event menu"
                icon={<TbDots />}
                isRound
              />
              <MenuList shadow="lg">
                {data?.owner === user.email || user.role === 'admin' ? (
                  <>
                    {user.role === 'admin' && (
                      <>
                        <MenuItem
                          textStyle="title"
                          icon={<TbFlag />}
                          onClick={reportOnOpen}
                        >
                          報告
                        </MenuItem>
                        <ReportModal
                          isOpen={reportOpen}
                          onClose={reportOnClose}
                          event={data}
                        />
                      </>
                    )}
                    <MenuItem textStyle="title" icon={<TbEdit />} isDisabled>
                      編集
                    </MenuItem>
                    <MenuItem
                      textStyle="title"
                      icon={<TbTrash />}
                      color="red"
                      onClick={deleteOnOpen}
                    >
                      削除
                    </MenuItem>
                    <AlertDialog
                      isOpen={deleteOpen}
                      onClose={deleteOnClose}
                      leastDestructiveRef={cancelRef}
                      isCentered
                    >
                      <AlertDialogOverlay />
                      <AlertDialogContent rounded="xl">
                        <AlertDialogHeader>イベントの削除</AlertDialogHeader>
                        <AlertDialogBody>
                          <Center>
                            <Text textStyle="title">
                              本当にこのイベントを削除しますか？
                            </Text>
                          </Center>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                          <Button
                            variant="ghost"
                            rounded="lg"
                            onClick={deleteOnClose}
                          >
                            キャンセル
                          </Button>
                          <Button
                            ml={4}
                            colorScheme="red"
                            rounded="lg"
                            onClick={() => deleteSubmit()}
                            isLoading={deleteLoading}
                          >
                            削除
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <MenuItem icon={<TbFlag />} onClick={reportOnOpen}>
                      報告
                    </MenuItem>
                    <ReportModal
                      isOpen={reportOpen}
                      onClose={reportOnClose}
                      event={data}
                    />
                  </>
                )}
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Header>
      <Event id={id!} />
      <BottomNavbar />
    </>
  );
}

export default EventDetail;
