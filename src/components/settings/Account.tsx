import {
  Button,
  VStack,
  Center,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Icon,
  Input,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  Skeleton,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  TbAlertCircle,
  TbChevronDown,
  TbEdit,
  TbArrowNarrowDown,
  TbCopy,
  TbCheck,
} from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth';
import { useClassList, useCourseList, useGradeList } from '@/hooks/info';
import { useUser } from '@/hooks/user';
import SettingButton from './Button';
import { MotionCenter } from '../motion';
import ChakraPullToRefresh from '../layout/PullToRefresh';
import Loading from '../common/Loading';
import Profile from '../account/Profile';
import SettingCategory from './Category';

function Account() {
  const {
    update: { mutate: update, isLoading },
  } = useAuth();
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const { onCopy, hasCopied } = useClipboard(user.apiKey);
  const toast = useToast({
    position: 'top-right',
  });

  const {
    data: gradeList,
    error: gradeError,
    isLoading: gradeIsLoading,
  } = useGradeList();
  const {
    data: classList,
    error: classError,
    isLoading: classIsLoading,
  } = useClassList({ type: user?.type, grade: user?.grade });
  const {
    data: courseList,
    error: courseError,
    isLoading: courseIsLoading,
  } = useCourseList({ type: user?.type, grade: user?.grade });

  const {
    isOpen: isUsernameOpen,
    onOpen: onUsernameOpen,
    onClose: onUsernameClose,
  } = useDisclosure();
  const [username, setUsername] = useState(user.name);
  const isFulfilled = username.length <= 20;

  const list = [
    {
      label: 'アカウント名',
      description: 'Hato上で表示されるアカウント名。',
      onClick: onUsernameOpen,
      children: (
        <>
          <HStack rounded="md" py={2}>
            <Text textStyle="title" noOfLines={1}>
              {username}
            </Text>
            <Icon as={TbEdit} />
          </HStack>
          <Modal isOpen={isUsernameOpen} onClose={onUsernameClose} isCentered>
            <ModalOverlay />
            <ModalContent bg="panel" rounded="xl">
              <ModalHeader>アカウント名の変更</ModalHeader>
              <ModalBody>
                <VStack>
                  <Input
                    rounded="lg"
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={!isFulfilled}
                    placeholder="新しいアカウント名（20文字以内）"
                  />
                  {!isFulfilled && (
                    <Text fontWeight="bold" color="red.500" fontSize="sm">
                      ユーザー名は20文字以内にしてください。
                    </Text>
                  )}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  onClick={onUsernameClose}
                  mr={2}
                  rounded="lg"
                >
                  キャンセル
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={
                    isFulfilled
                      ? () => {
                          onUsernameClose();
                          update({ name: username });
                        }
                      : () => {}
                  }
                  rounded="lg"
                  isLoading={isLoading}
                >
                  変更する
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ),
    },
    {
      label: '学年',
      description: '自分が所属している学年。',
      children: (
        // <Select variant="unstyled" textStyle="title" placeholder="選択してください">
        //   {grades.map(({ type, grade, label }) => (
        //     <option value={[type, grade.toString()]}>{label}</option>
        //   ))}
        // </Select>
        <Menu>
          <Skeleton isLoaded={!gradeIsLoading} rounded="lg">
            {gradeError ? (
              <HStack py={2}>
                <Icon as={TbAlertCircle} color="red.500" />
                <Text textStyle="title">エラー</Text>
              </HStack>
            ) : (
              <MenuButton rounded="lg" w="100%">
                <HStack py={2} pl={4} justify="flex-end">
                  <Text textStyle="title">
                    {gradeList?.find(
                      ({ type, grade_num }) =>
                        type === user?.type && grade_num === user?.grade
                    )?.name ?? '未設定'}
                  </Text>
                  <Icon as={TbChevronDown} />
                </HStack>
              </MenuButton>
            )}
          </Skeleton>
          <MenuList shadow="lg" rounded="xl" py={2}>
            {gradeList?.map(({ name, type, grade_num }) => (
              <MenuItem
                onClick={() => {
                  update({ type, grade: grade_num });
                }}
                key={name}
                fontWeight="bold"
              >
                {name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ),
    },
    {
      label: 'クラス',
      description: '自分が所属しているクラス。',
      children: (
        // <Select variant="unstyled" textStyle="title">
        //   {classes.map(({ class: schoolClass, label }) => (
        //     <option value={schoolClass}>{label}</option>
        //   ))}
        // </Select>
        <Menu>
          <Skeleton isLoaded={!classIsLoading} rounded="lg">
            {classError ? (
              <HStack py={2}>
                <Icon as={TbAlertCircle} color="red.500" />
                <Text textStyle="title">エラー</Text>
              </HStack>
            ) : (
              <MenuButton rounded="lg" w="100%">
                <HStack rounded="xl" py={2} pl={4} justify="flex-end">
                  <Text textStyle="title">
                    {classList?.find(
                      ({ class_num }) => class_num === user?.class
                    )?.name ?? '未設定'}
                  </Text>
                  <Icon as={TbChevronDown} />
                </HStack>
              </MenuButton>
            )}
          </Skeleton>
          <MenuList shadow="lg" rounded="xl">
            {classList?.map(({ class_num, name }) => (
              <MenuItem
                onClick={() => {
                  update({ class: class_num });
                }}
                key={name}
                fontWeight="bold"
              >
                {name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ),
    },
    courseList?.length
      ? {
          label: 'コース',
          description: '自分が所属しているコース。',
          children: (
            <Menu>
              <Skeleton isLoaded={!courseIsLoading} rounded="lg">
                {courseError ? (
                  <HStack py={2}>
                    <Icon as={TbAlertCircle} color="red.500" />
                    <Text textStyle="title">エラー</Text>
                  </HStack>
                ) : (
                  <MenuButton rounded="lg" w="100%">
                    <HStack rounded="xl" py={2} pl={4} justify="flex-end">
                      <Text textStyle="title">
                        {courseList?.find(({ code }) => code === user?.course)
                          ?.name ?? '未設定'}
                      </Text>
                      <Icon as={TbChevronDown} />
                    </HStack>
                  </MenuButton>
                )}
              </Skeleton>
              <MenuList shadow="lg" rounded="xl">
                {courseList?.map(({ name, code }) => (
                  <MenuItem
                    onClick={() => {
                      update({ course: code });
                    }}
                    key={name}
                    fontWeight="bold"
                  >
                    {name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ),
        }
      : undefined,
  ].filter(
    (
      settingsButton
    ): settingsButton is Exclude<typeof settingsButton, undefined> =>
      !!settingsButton
  );

  const listForDevs = useMemo(
    () => [
      {
        label: 'APIキー',
        description: 'APIにアクセスする際に必要なキーです。',
        children: (
          <HStack
            onClick={() => {
              onCopy();
              toast({
                title: 'コピーしました。',
                status: 'success',
              });
            }}
          >
            <Text wordBreak="break-all" noOfLines={1} textStyle="title">
              {user.apiKey.slice(0, 4).padEnd(22, '*')}
            </Text>
            <Icon
              transition="all .2s ease"
              color={hasCopied ? 'green.400' : undefined}
              as={hasCopied ? TbCheck : TbCopy}
            />
          </HStack>
        ),
      },
    ],
    [toast, user, onCopy, hasCopied]
  );

  return (
    <MotionCenter
      w="100%"
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }}
      layout
    >
      <ChakraPullToRefresh
        w="100%"
        pb={16}
        onRefresh={async () => {
          await Promise.all([queryClient.invalidateQueries(['user'])]);
        }}
        refreshingContent={<Loading />}
        pullingContent={
          <Center flexGrow={1} p={4}>
            <Icon as={TbArrowNarrowDown} w={6} h={6} color="gray.500" />
          </Center>
        }
      >
        {/* <VStack w='100%'>
      <Avatar src={user?.avatar} />
      <Text textStyle='title' fontSize='2xl'>{user?.name}</Text>
      <Text textStyle='description'>{user?.email}</Text>
      <Text fontSize='lg' fontWeight='bold' >{user?.contributionCount} pt</Text>
      </VStack> */}

        <VStack spacing={8} align="flex-start" w="100%">
          <SettingCategory title="プロフィール">
            <Profile />
          </SettingCategory>
          <SettingCategory title="アカウント">
            <VStack w="100%" spacing={1}>
              {list.map((elem) => (
                <SettingButton {...elem} key={elem.label} />
              ))}
            </VStack>
          </SettingCategory>
          <SettingCategory title="開発者向け">
            <VStack w="100%" spacing={1}>
              {listForDevs.map((elem) => (
                <SettingButton {...elem} key={elem.label} />
              ))}
            </VStack>
          </SettingCategory>
        </VStack>
      </ChakraPullToRefresh>
    </MotionCenter>
  );
}

export default Account;
