import {
  Heading,
  HStack,
  IconButton,
  VStack,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  ModalFooter,
  Center,
  Spacer,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { TbDots, TbEdit, TbTrash, TbFlag } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useMemo } from 'react';
import { Select } from 'chakra-react-select';
import BottomNavbar from '../components/nav/BottomNavbar';
import Header from '../components/nav/Header';
import { useClient } from '../modules/client';
import Error from '../components/cards/Error';
import Event from '../components/calendar/Event';
import BackButton from '../components/layout/BackButton';
import { useUser } from '../hooks/user';

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

  const [reportType, setReportType] = useState('');
  const [reportComment, setReportComment] = useState('');

  const reportOptions = useMemo(
    () => [
      {
        label: '不正確な情報が含まれている',
        value: 'inaccurate information',
      },
      {
        label: '不適切なコンテンツである',
        value: 'Inappropriate content',
      },
    ],
    []
  );

  const { mutate: reportSubmit, isLoading: reportLoading } = useMutation(
    () =>
      client.post('/report', {
        content: null,
        embeds: [
          {
            title: 'Report',
            url: `https://hato.cf/calendar/events/${id}`,
            color: 5814783,
            fields: [
              {
                name: 'Report reason',
                value: reportType,
              },
              {
                name: 'Comment',
                value: reportComment || 'none',
              },
            ],
            author: {
              name: user?.name,
              icon_url: user?.avatar,
            },
            footer: {
              text: user?.email,
              icon_url: user?.avatar,
            },
            timestamp: new Date().toISOString(),
          },
        ],
        attachments: [],
      }),
    {
      onSuccess: () => {
        reportOnClose();
        toast({
          title: '報告しました。',
          status: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'エラーが発生しました。',
          status: 'error',
        });
      },
    }
  );

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
        <HStack w="100%" px={2}>
          <BackButton />
          <Heading size="md" py={4}>
            イベントの詳細
          </Heading>
          <Spacer />
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
                  <MenuItem icon={<TbEdit />} isDisabled>
                    編集
                  </MenuItem>
                  <MenuItem
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
                  <Modal isOpen={reportOpen} onClose={reportOnClose} isCentered>
                    <ModalOverlay />
                    <ModalContent rounded="xl">
                      <ModalHeader>イベントの報告</ModalHeader>
                      <ModalBody>
                        <VStack align="flex-start">
                          <Text textStyle="title">タイプを選択</Text>
                          <Select
                            options={reportOptions}
                            chakraStyles={{
                              container: (provided) => ({
                                ...provided,
                                w: '100%',
                              }),
                            }}
                            onChange={(value) =>
                              setReportType(value?.label ?? '')
                            }
                          />
                          <Text textStyle="title">コメント（任意）</Text>
                          <Textarea
                            rounded="lg"
                            onChange={(e) => setReportComment(e.target.value)}
                          />
                        </VStack>
                      </ModalBody>
                      <ModalFooter>
                        <HStack>
                          <Button
                            variant="ghost"
                            rounded="lg"
                            onClick={reportOnClose}
                          >
                            キャンセル
                          </Button>
                          <Button
                            colorScheme="blue"
                            rounded="lg"
                            onClick={() => reportSubmit()}
                            isLoading={reportLoading}
                            isDisabled={!reportType}
                          >
                            送信
                          </Button>
                        </HStack>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              )}
            </MenuList>
          </Menu>
        </HStack>
      </Header>
      <Event id={id!} />
      <BottomNavbar />
    </>
  );
}

export default EventDetail;
