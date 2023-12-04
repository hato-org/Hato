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
  Icon,
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { TbDots, TbEdit, TbTrash, TbFlag } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Header from '@/components/nav/Header';
import Error from '@/components/cards/Error';
import Event from '@/components/calendar/Event';
import BackButton from '@/components/layout/BackButton';
import { useUser } from '@/services/user';
import ReportModal from '@/components/common/ReportModal';
import { useEvent, useEventMutation } from '@/services/calendar';

function EventDetail() {
  const { id = '' } = useParams();
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

  const { data, error } = useEvent(id);
  const { mutate, isPending } = useEventMutation();

  if (error) return <Error error={error} />;

  return (
    <Box>
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
              <MenuList rounded="xl" shadow="lg">
                {data?.owner === user.email || user.role === 'admin' ? (
                  <>
                    {user.role === 'admin' && (
                      <>
                        <MenuItem
                          textStyle="title"
                          icon={<Icon as={TbFlag} />}
                          onClick={reportOnOpen}
                        >
                          報告
                        </MenuItem>
                        <ReportModal
                          isOpen={reportOpen}
                          onClose={reportOnClose}
                          url={window.location.toString()}
                        />
                      </>
                    )}
                    <MenuItem
                      textStyle="title"
                      icon={<Icon as={TbEdit} boxSize={4} />}
                      isDisabled
                    >
                      編集
                    </MenuItem>
                    <MenuItem
                      textStyle="title"
                      icon={<Icon as={TbTrash} boxSize={4} />}
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
                      <AlertDialogContent p={2} bg="panel" rounded="xl">
                        <AlertDialogHeader>イベントの削除</AlertDialogHeader>
                        <AlertDialogBody>
                          <Center>
                            <Text textStyle="title">
                              本当にこのイベントを削除しますか？
                            </Text>
                          </Center>
                        </AlertDialogBody>
                        <AlertDialogFooter w="full" gap={4}>
                          <Button
                            w="full"
                            variant="ghost"
                            rounded="lg"
                            onClick={deleteOnClose}
                          >
                            キャンセル
                          </Button>
                          <Button
                            w="full"
                            colorScheme="red"
                            rounded="lg"
                            onClick={() =>
                              mutate(
                                { action: 'delete', id },
                                {
                                  onSuccess: () => {
                                    toast({
                                      title: 'イベントを削除しました。',
                                      status: 'success',
                                    });
                                    deleteOnClose();
                                    navigate(-1);
                                  },
                                  onError: (e) => {
                                    toast({
                                      title: 'イベントの削除に失敗しました。',
                                      description: e.message,
                                      status: 'error',
                                    });
                                    deleteOnClose();
                                  },
                                },
                              )
                            }
                            isLoading={isPending}
                          >
                            削除
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <MenuItem
                      textStyle="title"
                      icon={<Icon as={TbFlag} />}
                      onClick={reportOnOpen}
                    >
                      報告
                    </MenuItem>
                    <ReportModal
                      isOpen={reportOpen}
                      onClose={reportOnClose}
                      url={window.location.toString()}
                    />
                  </>
                )}
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Header>
      <Event id={id!} />
    </Box>
  );
}

export default EventDetail;
