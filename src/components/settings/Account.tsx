import {
  Button,
  VStack,
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
  Heading,
  Skeleton,
  Avatar,
  StackDivider,
  Spacer,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { TbAlertCircle, TbChevronDown, TbEdit } from 'react-icons/tb';
import html2canvas from 'html2canvas';
import { useAuth } from '../../modules/auth';
import SettingButton, { SettingButtonProps } from './Button';
import { MotionVStack } from '../motion';
import { useClassList, useCourseList, useGradeList } from '../../hooks/info';
import { useUser } from '../../hooks/user';

function Account() {
  const {
    update: { mutate: update, isLoading },
  } = useAuth();
  const { data: user } = useUser();

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState(user.name);
  const isFulfilled = username.length <= 20;

  const downloadProfile = async () => {
    const target = document.getElementById('profile-image');
    const canvas = await html2canvas(target!);
    canvas.toBlob((blob) => {
      const blobURL = URL.createObjectURL(blob!);
      window.open(blobURL);
    }, 'img/png');
    // const image = new Image();
    // image.src = canvas.toDataURL();
    // const imageWindow = window.open(canvas.toDataURL('image/png'), '_blank');
    // imageWindow?.document.write(image.outerHTML)
  };

  const list = useMemo<SettingButtonProps[]>(
    () => [
      {
        label: 'アカウント名',
        description: 'アカウント名を変更できます。',
        children: (
          <>
            <HStack rounded="md" onClick={onOpen} py={2}>
              <Text textStyle="title" noOfLines={1}>
                {username}
              </Text>
              <Icon as={TbEdit} />
            </HStack>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent rounded="xl">
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
                  <Button variant="ghost" onClick={onClose} mr={2} rounded="lg">
                    キャンセル
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={
                      isFulfilled
                        ? () => {
                            onClose();
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
        description: '学年を変更できます。',
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
                <MenuButton rounded="lg">
                  <HStack py={2} pl={4}>
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
                  onClick={async () => {
                    await update({ type, grade: grade_num });
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
        description: 'クラスを変更できます。',
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
                <MenuButton rounded="lg">
                  <HStack rounded="xl" py={2} pl={4}>
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
      {
        label: 'コース',
        description: 'コースを変更できます。',
        children: (
          <Menu>
            <Skeleton isLoaded={!courseIsLoading} rounded="lg">
              {courseError ? (
                <HStack py={2}>
                  <Icon as={TbAlertCircle} color="red.500" />
                  <Text textStyle="title">エラー</Text>
                </HStack>
              ) : (
                <MenuButton rounded="lg">
                  <HStack rounded="xl" py={2} pl={4}>
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
                  onClick={async () => {
                    await update({ course: code });
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
    ],
    [
      user,
      isLoading,
      gradeList,
      gradeIsLoading,
      gradeError,
      classList,
      classIsLoading,
      classError,
      courseList,
      courseIsLoading,
      courseError,
      isOpen,
      onOpen,
      onClose,
      username,
      update,
      isFulfilled,
    ]
  );

  return (
    <MotionVStack
      w="100%"
      spacing={4}
      align="flex-start"
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
      {/* <VStack w='100%'>
      <Avatar src={user?.avatar} />
      <Text textStyle='title' fontSize='2xl'>{user?.name}</Text>
      <Text textStyle='description'>{user?.email}</Text>
      <Text fontSize='lg' fontWeight='bold' >{user?.contributionCount} pt</Text>
      </VStack> */}

      <Heading size="lg">プロフィール</Heading>

      <HStack
        w="100%"
        justify="center"
        spacing={4}
        divider={<StackDivider borderColor="blue.300" borderWidth={1} />}
        p={4}
        rounded="xl"
        id="profile-image"
        onClick={async () => {
          await downloadProfile();
        }}
        // border="1px solid"
        // borderColor="gray.100"
        // shadow="xl"
      >
        <Avatar src={user?.avatar} size="lg" />
        <VStack align="flex-start" spacing={0}>
          <HStack w="100%">
            <Text textStyle="title" fontSize="xl">
              {user?.name}
            </Text>
            <Spacer />
            <Text fontSize="sm" color="gray.500" fontWeight="bold">
              {user?.contributionCount} pt
            </Text>
          </HStack>
          <Text color="gray.400" fontSize="xs">
            {user?.email}
          </Text>
          <HStack w="100%" align="flex-end">
            <Text fontWeight="bold">
              {user?.grade}-{user?.class}{' '}
            </Text>
            <Text fontWeight="bold">
              {courseList?.find((course) => user?.course === course.code)?.name}
            </Text>
            <Spacer />
            {/* <Text fontSize="xs" color="gray.500" fontWeight="bold">
              {user?.contributionCount} pt
            </Text> */}
          </HStack>
        </VStack>
      </HStack>

      <Heading size="lg">アカウント</Heading>
      <VStack w="100%" spacing={1}>
        {list.map((elem) => (
          <SettingButton {...elem} key={elem.label} />
        ))}
      </VStack>
    </MotionVStack>
  );
}

export default Account;
