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
import { useClassList, useGradeList } from '@/services/info';

interface GradeClassPickerProps extends StackProps {
  onGradeSelect: (gradeInfo: GradeInfo) => void;
  onClassSelect: (classInfo: ClassInfo) => void;
  defaultType?: Type;
  defaultGrade?: GradeCode;
  defaultClass?: ClassCode;
}

const GradeClassPicker = React.memo(
  ({
    onGradeSelect,
    onClassSelect,
    defaultType,
    defaultGrade,
    defaultClass,
    ...rest
  }: GradeClassPickerProps) => {
    const [type, setType] = useState<Type | undefined>(defaultType);
    const [grade, setGrade] = useState<GradeInfo>();
    const [schoolClass, setClass] = useState<ClassInfo>();

    const { data: gradeList } = useGradeList();

    const { data: classList } = useClassList(
      {
        type,
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
      if (!schoolClass)
        setClass(
          classList?.find(({ classCode }) => classCode === defaultClass),
        );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gradeList, classList]);

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
                    (defaultGrade
                      ? gradeList?.find(
                          (gradeInfo) =>
                            defaultType === gradeInfo.type &&
                            defaultGrade === gradeInfo.gradeCode,
                        )?.shortName
                      : '学年')}
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
                    setType(gradeInfo.type);
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
                    (defaultClass
                      ? classList?.find(
                          ({ classCode }) => classCode === defaultClass,
                        )?.name
                      : 'クラス')}
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
      </Stack>
    );
  },
);

export default GradeClassPicker;
