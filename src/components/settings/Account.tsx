import {
  Button,
  VStack,
  Text,
  Select,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Icon,
  useBoolean,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { TbCheck, TbChevronDown, TbEdit } from "react-icons/tb";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import { MotionCenter } from "../motion";
import SettingButton, { SettingButtonProps } from "./Button";

interface GradeProps {
  label: string;
  type: Type;
  grade: number;
}

interface ClassProps {
  label: string;
  class: "A" | "B" | number;
}

interface CourseProps {
  label: string;
  course: Course;
}

const Account = () => {
  const { user, update } = useAuth();

  const grades = useMemo<GradeProps[]>(
    () => [
      {
        label: "中学1年",
        type: "jhs",
        grade: 1,
      },
      {
        label: "中学2年",
        type: "jhs",
        grade: 2,
      },
      {
        label: "中学3年",
        type: "jhs",
        grade: 3,
      },
      {
        label: "高校1年",
        type: "hs",
        grade: 1,
      },
      {
        label: "高校2年",
        type: "hs",
        grade: 2,
      },
      {
        label: "高校3年",
        type: "hs",
        grade: 3,
      },
    ],
    []
  );

  const classes = useMemo<ClassProps[]>(() => {
    if (user?.type === "jhs") {
      return [
        {
          label: "A組",
          class: "A",
        },
        {
          label: "B組",
          class: "B",
        },
      ];
    } else if (user?.type === "hs") {
      return [
        {
          label: "1組",
          class: 1,
        },
        {
          label: "2組",
          class: 2,
        },
        {
          label: "3組",
          class: 3,
        },
        {
          label: "4組",
          class: 4,
        },
        {
          label: "5組",
          class: 5,
        },
        {
          label: "6組",
          class: 6,
        },
        {
          label: "7組",
          class: 7,
        },
      ];
    } else {
      return [];
    }
  }, [user]);

  const courses = useMemo<CourseProps[]>(() => {
    if (user?.type === "hs" && user.grade > 1) {
      return [
        {
          label: "文系A",
          course: "libA",
        },
        {
          label: "文系B",
          course: "libB",
        },
        {
          label: "文系C",
          course: "libC",
        },
        {
          label: "文系Z",
          course: "libZ",
        },
        {
          label: "理系D",
          course: "sciD",
        },
        {
          label: "理系E",
          course: "sciE",
        },
        {
          label: "理系X",
          course: "sciX",
        },
        {
          label: "理系Y",
          course: "sciY",
        },
      ];
    } else {
      return [];
    }
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const isFulfilled = name.length <= 20;
  console.log(name);

  const list = useMemo<SettingButtonProps[]>(
    () => [
      {
        label: "アカウント名",
        description: "アカウント名を変更できます。",
        children: (
          <>
            <HStack onClick={onOpen} py={2}>
              <Text color="gray.500" fontWeight="bold" noOfLines={1}>
                {user?.name}
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
                      rounded="xl"
                      onChange={(e) => setName(e.target.value)}
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
                  <Button variant="ghost" onClick={onClose} mr={2} rounded="xl">
                    キャンセル
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={
                      isFulfilled
                        ? () => {
                            onClose();
                            update({ name });
                          }
                        : () => {}
                    }
                    rounded="xl"
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
        label: "学年",
        description: "学年を変更できます。",
        children: (
          // <Select variant="unstyled" textStyle="title" placeholder="選択してください">
          //   {grades.map(({ type, grade, label }) => (
          //     <option value={[type, grade.toString()]}>{label}</option>
          //   ))}
          // </Select>
          <Menu>
            <MenuButton>
              <HStack rounded="xl" py={2} pl={4}>
                <Text textStyle="title">
                  {grades.find(
                    ({ type, grade }) =>
                      type === user?.type && grade === user?.grade
                  )?.label ?? "未設定"}
                </Text>
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList>
              {grades.map(({ label, type, grade }) => (
                <MenuItem
                  onClick={async () => {
                    await update({ type, grade });
                  }}
                  key={label}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ),
      },
      {
        label: "クラス",
        description: "クラスを変更できます。",
        children: (
          // <Select variant="unstyled" textStyle="title">
          //   {classes.map(({ class: schoolClass, label }) => (
          //     <option value={schoolClass}>{label}</option>
          //   ))}
          // </Select>
          <Menu>
            <MenuButton>
              <HStack rounded="xl" py={2} pl={4}>
                <Text textStyle="title">
                  {classes.find(
                    ({ class: schoolClass }) => schoolClass === user?.class
                  )?.label ?? "未設定"}
                </Text>
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList>
              {classes.map((schoolClass) => (
                <MenuItem
                  onClick={async () => {
                    await update({ class: schoolClass.class });
                  }}
                  key={schoolClass.label}
                >
                  {schoolClass.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ),
      },
      {
        label: "コース",
        description: "コースを変更できます。",
        children: (
          <Menu>
            <MenuButton>
              <HStack rounded="xl" py={2} pl={4}>
                <Text textStyle="title">
                  {courses.find(({ course }) => course === user?.course)
                    ?.label ?? "未設定"}
                </Text>
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList>
              {courses.map(({ label, course }) => (
                <MenuItem
                  onClick={async () => {
                    await update({ course });
                  }}
                  key={label}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        ),
      },
    ],
    [user, grades, classes, courses, isOpen, onOpen, onClose, name]
  );

  return (
    <VStack w="100%" minH="100vh" spacing={4}>
      {list.map((elem) => (
        <SettingButton {...elem} key={elem.label} />
      ))}
    </VStack>
  );
};

export default Account;
