import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { TbChevronDown } from 'react-icons/tb';
import { useClassList, useCourseList, useGradeList } from '@/services/info';

interface GradeClassPickerProps extends StackProps {
  onGradeSelect: (gradeInfo: GradeInfo) => void;
  onClassSelect: (classInfo: ClassInfo) => void;
  onCourseSelect?: (courseInfo: CourseInfo) => void;
  defaultType?: Type;
  defaultGrade?: GradeCode;
  defaultClass?: ClassCode;
  defaultCourse?: CourseCode;
}

const GradeClassPicker = React.memo(
  ({
    onGradeSelect,
    onClassSelect,
    onCourseSelect,
    defaultType,
    defaultGrade,
    defaultClass,
    defaultCourse,
    ...rest
  }: GradeClassPickerProps) => {
    const [grade, setGrade] = useState<GradeInfo>();
    const [schoolClass, setClass] = useState<ClassInfo>();
    const [course, setCourse] = useState<CourseInfo>();

    const { data: gradeList, isLoading: gradeInitialLoading } = useGradeList();

    const { data: classList, isLoading: classInitialLoading } = useClassList(
      {
        type: grade?.type,
        grade: grade?.gradeCode ?? defaultGrade,
      },
      {
        enabled: !!(grade || defaultGrade),
      },
    );

    const { data: courseList, isLoading: courseInitialLoading } = useCourseList(
      {
        type: grade?.type,
        grade: grade?.gradeCode ?? defaultGrade,
      },
      {
        enabled: !!(grade || defaultGrade),
      },
    );

    useEffect(() => {
      if (!grade)
        setGrade(
          gradeList?.find(
            ({ type: gradeType, gradeCode }) =>
              gradeType === defaultType && gradeCode === defaultGrade,
          ),
        );
    }, [gradeInitialLoading]);

    useEffect(() => {
      if (!schoolClass)
        setClass(
          classList?.find(({ classCode }) => classCode === defaultClass),
        );
    }, [classInitialLoading]);

    useEffect(() => {
      if (!course)
        setCourse(courseList?.find(({ code }) => code === defaultCourse));
    }, [courseInitialLoading]);

    useEffect(() => {
      if (schoolClass) setClass(undefined);
      if (course) setCourse(undefined);
    }, [grade]);

    return (
      <Stack w="100%" {...rest}>
        <Box w="100%">
          <Menu>
            <MenuButton
              w="100%"
              h="full"
              rounded="lg"
              layerStyle="button"
              border="1px solid"
              borderColor="border"
            >
              <HStack w="100%" px={4} py={2} textStyle="title">
                <Text>
                  {grade?.shortName ??
                    gradeList?.find(
                      (gradeInfo) =>
                        defaultType === gradeInfo.type &&
                        defaultGrade === gradeInfo.gradeCode,
                    )?.shortName ??
                    '学年'}
                </Text>
                <Spacer />
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList shadow="lg" rounded="xl">
              {gradeList?.map((gradeInfo) => (
                <MenuItem
                  key={gradeInfo.name}
                  fontWeight="bold"
                  onClick={() => {
                    setGrade(gradeInfo);
                    onGradeSelect(gradeInfo);
                  }}
                >
                  {gradeInfo.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
        <Box w="100%">
          <Menu>
            <MenuButton
              w="100%"
              h="full"
              rounded="lg"
              layerStyle="button"
              border="1px solid"
              borderColor="border"
            >
              <HStack w="100%" px={4} py={2} textStyle="title">
                <Text>
                  {schoolClass?.name ??
                    classList?.find(
                      ({ classCode }) => classCode === defaultClass,
                    )?.name ??
                    'クラス'}
                </Text>
                <Spacer />
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList shadow="lg" rounded="xl">
              {grade ? (
                classList?.map((classInfo) => (
                  <MenuItem
                    key={classInfo.name}
                    fontWeight="bold"
                    onClick={() => {
                      setClass(classInfo);
                      onClassSelect(classInfo);
                    }}
                  >
                    {classInfo.name}
                  </MenuItem>
                ))
              ) : (
                <Text
                  w="full"
                  py={2}
                  textAlign="center"
                  textStyle="description"
                  fontWeight="bold"
                >
                  最初に学年を選択
                </Text>
              )}
            </MenuList>
          </Menu>
        </Box>
        {onCourseSelect && (
          <Box w="100%">
            <Menu>
              <MenuButton
                w="100%"
                h="full"
                rounded="lg"
                layerStyle="button"
                border="1px solid"
                borderColor="border"
              >
                <HStack w="100%" px={4} py={2} textStyle="title">
                  <Text>
                    {course?.name ??
                      courseList?.find(({ code }) => code === defaultCourse)
                        ?.name ??
                      '講座'}
                  </Text>
                  <Spacer />
                  <Icon as={TbChevronDown} />
                </HStack>
              </MenuButton>
              <MenuList shadow="lg" rounded="xl">
                {grade ? (
                  courseList?.map((courseInfo) => (
                    <MenuItem
                      key={courseInfo.name}
                      fontWeight="bold"
                      onClick={() => {
                        setCourse(courseInfo);
                        onCourseSelect(courseInfo);
                      }}
                    >
                      {courseInfo.name}
                    </MenuItem>
                  ))
                ) : (
                  <Text
                    w="full"
                    py={2}
                    textAlign="center"
                    textStyle="description"
                    fontWeight="bold"
                  >
                    最初に学年を選択
                  </Text>
                )}
              </MenuList>
            </Menu>
          </Box>
        )}
      </Stack>
    );
  },
);

export default GradeClassPicker;
