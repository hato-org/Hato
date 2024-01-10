import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  HStack,
  Heading,
  Icon,
  Input,
  Spacer,
  Switch,
  Text,
  VStack,
  useBoolean,
} from '@chakra-ui/react';
import { TbSearch } from 'react-icons/tb';
import Card from '@/components/layout/Card';
import UserScheduleCard from './Card';
import { useUserScheduleSearch } from '@/services/timetable';
import { useUser } from '@/services/user';
import GradeClassPicker from '../GradeClassPicker';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';

export function UserScheduleSearch() {
  const { data: user } = useUser();
  const { mutate, data, isPending, error } = useUserScheduleSearch();

  const [isFilterEnabled, { toggle }] = useBoolean(false);

  const [inputVal, setInputVal] = useState<string>();
  const [grade, setGrade] = useState<GradeInfo>();
  const [classInfo, setClass] = useState<ClassInfo>();
  const [course, setCourse] = useState<CourseInfo>();

  return (
    <VStack w="full" gap={8}>
      <Card w="full" p={4}>
        <VStack align="flex-start" gap={6}>
          <Heading px={2} pt={2} as="h3" size="md">
            時間割検索・インポート
          </Heading>
          <Input
            fontWeight="bold"
            placeholder="時間割名・キーワードで検索..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value || undefined)}
          />
          <HStack w="full">
            <Text fontWeight="bold">学年・クラス・講座で絞り込む</Text>
            <Spacer />
            <Switch checked={isFilterEnabled} onChange={toggle} />
          </HStack>
          <Box w="full">
            <Collapse in={isFilterEnabled}>
              <GradeClassPicker
                onGradeSelect={setGrade}
                onClassSelect={setClass}
                onCourseSelect={setCourse}
                direction={{ base: 'column', md: 'row' }}
              />
            </Collapse>
          </Box>
          <Button
            leftIcon={<Icon as={TbSearch} />}
            w="full"
            rounded="lg"
            colorScheme="blue"
            onClick={() =>
              mutate({
                title: inputVal,
                description: inputVal,
                private: false,
                ...(isFilterEnabled && {
                  meta: {
                    type: grade?.type,
                    grade: grade?.gradeCode,
                    class: classInfo?.classCode,
                    course: course?.code,
                  },
                }),
              })
            }
            isLoading={isPending}
          >
            検索
          </Button>
        </VStack>
      </Card>
      {isPending ? (
        <Loading />
      ) : error ? (
        <Error error={error} />
      ) : data?.length === 0 ? (
        <Text textStyle="description" fontWeight="bold">
          該当する時間割がありません
        </Text>
      ) : (
        <VStack w="full" gap={4}>
          {data
            ?.filter(({ owner }) => owner !== user._id)
            .map((schedule) => (
              <UserScheduleCard key={schedule._id} {...schedule} />
            ))}
        </VStack>
      )}
    </VStack>
  );
}
