import { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  StackProps,
  Text,
} from '@chakra-ui/react';
import { TbChevronDown } from 'react-icons/tb';
import { useClassList, useGradeList } from '@/hooks/info';
import { useUser } from '@/hooks/user';

interface GradeClassPickerProps extends StackProps {
  onGradeSelect: (gradeInfo: GradeInfo) => void;
  onClassSelect: (classInfo: ClassInfo) => void;
}

function GradeClassPicker({
  onGradeSelect,
  onClassSelect,
  ...rest
}: GradeClassPickerProps) {
  const { data: user } = useUser();

  const [type, setType] = useState(user.type);
  const [grade, setGrade] = useState<GradeInfo>();
  const [schoolClass, setClass] = useState<ClassInfo>();

  const { data: gradeList } = useGradeList();

  const { data: classList } = useClassList(
    {
      type,
      grade: grade?.grade_num,
    },
    {
      enabled: !!grade,
    }
  );

  useEffect(() => {
    setGrade(
      gradeList?.find(
        (gradeInfo) =>
          gradeInfo.type === type && gradeInfo.grade_num === user?.grade
      )
    );
  }, [gradeList]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setClass(
      classList?.find((classInfo) => classInfo.class_num === user.class)
    );
  }, [classList]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HStack w="100%" {...rest}>
      <Box w="100%">
        <Menu>
          <MenuButton
            w="100%"
            rounded="lg"
            layerStyle="button"
            // borderColor="border"
          >
            <HStack w="100%" px={4} py={2} textStyle="title">
              <Text>{grade?.name}</Text>
              <Spacer />
              <Icon as={TbChevronDown} />
            </HStack>
            {/* <Button w='100%' variant='ghost' rightIcon={<TbChevronDown />}>
            <Text>{grade?.name}</Text>
          </Button> */}
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
            rounded="lg"
            layerStyle="button"
            // borderColor="border"
          >
            <HStack w="100%" px={4} py={2} textStyle="title">
              <Text>{schoolClass?.name}</Text>
              <Spacer />
              <Icon as={TbChevronDown} />
            </HStack>
            {/* <Button w="100%" variant="ghost" rightIcon={<TbChevronDown />}>
            <Text>{schoolClass?.name}</Text>
          </Button> */}
          </MenuButton>
          <MenuList shadow="lg" rounded="xl">
            {classList?.map((classInfo) => (
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
            ))}
          </MenuList>
        </Menu>
      </Box>
    </HStack>
  );
}

export default GradeClassPicker;
