import React from 'react';
import {
  Box,
  Button,
  Collapse,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Switch,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { TbChevronDown, TbExclamationCircle } from 'react-icons/tb';
import { useClassList, useCourseList, useGradeList } from '@/services/info';
import { useUserScheduleContext } from './context';

export const UserScheduleMetaEditor = React.memo(
  ({
    onVisibilityChange,
  }: {
    onVisibilityChange: React.ChangeEventHandler<HTMLInputElement>;
  }) => {
    const [schedule, setSchedule] = useUserScheduleContext();
    const { _id, title, description, meta, private: isPrivate } = schedule;
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
    const { data: gradeList } = useGradeList();
    const { data: classList } = useClassList({
      type: meta.type,
      grade: meta.grade,
    });
    const { data: courseList } = useCourseList({
      type: meta.type,
      grade: meta.grade,
    });

    return (
      <VStack
        w="full"
        rounded="xl"
        border="1px solid"
        borderColor="border"
        overflow="hidden"
        spacing={0}
      >
        <HStack w="full" p={4} onClick={onToggle} layerStyle="button">
          <Text textStyle="title" fontSize="xl">
            時間割情報
          </Text>
          <Spacer />
          <Icon
            as={TbChevronDown}
            transform={`rotate(${isOpen ? '180deg' : '0deg'})`}
            transition="all .2s ease"
          />
        </HStack>
        <Box w="full">
          <Collapse in={isOpen}>
            <VStack p={4} spacing={4}>
              <Input
                size="lg"
                textStyle="title"
                placeholder="時間割の名前"
                variant="flushed"
                value={title}
                onChange={(e) =>
                  setSchedule((val) => ({ ...val, title: e.target.value }))
                }
                isInvalid={!title}
              />
              <Input
                textStyle="title"
                placeholder="時間割の説明"
                variant="flushed"
                value={description ?? ''}
                onChange={(e) =>
                  setSchedule((val) => ({
                    ...val,
                    description: e.target.value,
                  }))
                }
              />
              <HStack w="full">
                <Text textStyle="title">非公開</Text>
                <Spacer />
                <Switch isChecked={isPrivate} onChange={onVisibilityChange} />
              </HStack>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <VStack w="full">
                    <HStack w="full">
                      <Text textStyle="title">学年</Text>
                      <Spacer />
                      <Menu>
                        <MenuButton
                          as={Button}
                          isDisabled={!!_id}
                          rightIcon={<Icon as={TbChevronDown} />}
                          variant="ghost"
                          rounded="lg"
                        >
                          {
                            gradeList?.find(
                              (grade) =>
                                grade.type === meta.type &&
                                grade.gradeCode === meta.grade,
                            )?.name
                          }
                        </MenuButton>
                        <MenuList shadow="lg" rounded="xl">
                          {gradeList?.map((gradeInfo) => (
                            <MenuItem
                              textStyle="title"
                              onClick={() =>
                                setSchedule((val) => ({
                                  ...val,
                                  meta: {
                                    ...val.meta,
                                    type: gradeInfo.type,
                                    grade: gradeInfo.gradeCode,
                                    course: undefined,
                                  },
                                }))
                              }
                            >
                              {gradeInfo.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </HStack>
                    <HStack w="full">
                      <Text textStyle="title">クラス</Text>
                      <Spacer />
                      <Menu>
                        <MenuButton
                          as={Button}
                          bg={!meta.class ? 'invalid' : undefined}
                          isDisabled={!!_id}
                          rightIcon={<Icon as={TbChevronDown} />}
                          variant="ghost"
                          rounded="lg"
                        >
                          {
                            classList?.find(
                              (classInfo) =>
                                classInfo.type === meta.type &&
                                classInfo.gradeCode === meta.grade &&
                                classInfo.classCode === meta.class,
                            )?.name
                          }
                        </MenuButton>
                        <MenuList shadow="lg" rounded="xl">
                          {classList?.map((classInfo) => (
                            <MenuItem
                              textStyle="title"
                              onClick={() =>
                                setSchedule((val) => ({
                                  ...val,
                                  meta: {
                                    ...val.meta,
                                    type: classInfo.type,
                                    grade: classInfo.gradeCode,
                                    class: classInfo.classCode,
                                  },
                                }))
                              }
                            >
                              {classInfo.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </HStack>
                    {courseList?.length && (
                      <HStack w="full">
                        <Text textStyle="title">コース</Text>
                        <Spacer />
                        <Menu>
                          <MenuButton
                            as={Button}
                            bg={!meta.course ? 'invalid' : undefined}
                            isDisabled={!!_id}
                            rightIcon={<Icon as={TbChevronDown} />}
                            variant="ghost"
                            rounded="lg"
                          >
                            {
                              courseList?.find(
                                (courseInfo) => courseInfo.code === meta.course,
                              )?.name
                            }
                          </MenuButton>
                          <MenuList shadow="lg" rounded="xl">
                            {courseList?.map((courseInfo) => (
                              <MenuItem
                                textStyle="title"
                                onClick={() =>
                                  setSchedule((val) => ({
                                    ...val,
                                    meta: {
                                      ...val.meta,
                                      course: courseInfo.code,
                                    },
                                  }))
                                }
                              >
                                {courseInfo.name}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                      </HStack>
                    )}
                  </VStack>
                </PopoverTrigger>
                <PopoverContent
                  p={4}
                  bg="panel"
                  shadow="lg"
                  rounded="xl"
                  borderColor="border"
                >
                  <PopoverBody>
                    <HStack w="full" justify="center">
                      <Icon
                        as={TbExclamationCircle}
                        boxSize={6}
                        color="yellow.400"
                      />
                      <Text textStyle="title">作成後は変更できません。</Text>
                    </HStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </VStack>
          </Collapse>
        </Box>
      </VStack>
    );
  },
);
