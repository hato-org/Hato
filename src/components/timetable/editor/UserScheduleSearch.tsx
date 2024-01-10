import { useEffect, useState } from 'react';
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
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '@/components/layout/Card';
import UserScheduleCard from './Card';
import { useUserScheduleSearch } from '@/services/timetable';
import { useUser } from '@/services/user';
import GradeClassPicker from '../GradeClassPicker';
import Loading from '@/components/common/Loading';
import Error from '@/components/cards/Error';

export function UserScheduleSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: user } = useUser();
  const { mutate, data, isPending, error } = useUserScheduleSearch();

  const [isFilterEnabled, { toggle }] = useBoolean(false);

  const [inputVal, setInputVal] = useState(searchParams.get('q') ?? '');
  const [grade, setGrade] = useState<GradeInfo>();
  const [classInfo, setClass] = useState<ClassInfo>();
  const [course, setCourse] = useState<CourseInfo>();

  useEffect(() => {
    const q = searchParams.get('q') || undefined;
    const type = (searchParams.get('type') as Type) ?? undefined;
    const gradeCode = (searchParams.get('grade') as GradeCode) ?? undefined;
    const classCode = (searchParams.get('class') as ClassCode) ?? undefined;
    const courseCode = (searchParams.get('course') as CourseCode) ?? undefined;

    if (location.pathname.includes('search'))
      mutate({
        _id: q,
        title: q,
        description: q,
        private: false,
        ...(isFilterEnabled && {
          meta: {
            type,
            grade: gradeCode,
            class: classCode,
            course: courseCode,
          },
        }),
      });
  }, [searchParams]);

  const onSubmit = () => {
    if (inputVal) searchParams.set('q', inputVal);
    else searchParams.delete('q');

    if (isFilterEnabled) {
      if (grade) {
        searchParams.set('type', grade.type);
        searchParams.set('grade', grade.gradeCode);
      }
      if (classInfo) searchParams.set('class', classInfo.classCode);
      if (course) searchParams.set('course', course.code);
    }
    if (!location.pathname.includes('search'))
      navigate('search', { replace: true });
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <VStack w="full" gap={8}>
      <Card w="full" p={4}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <VStack align="flex-start" gap={6}>
            <Heading px={2} pt={2} as="h3" size="md">
              時間割検索・インポート
            </Heading>
            <Input
              fontWeight="bold"
              placeholder="時間割名・キーワード・IDで検索..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
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
              type="submit"
              leftIcon={<Icon as={TbSearch} />}
              w="full"
              rounded="lg"
              colorScheme="blue"
              isLoading={isPending}
            >
              検索
            </Button>
          </VStack>
        </form>
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
              <UserScheduleCard
                // expand by default when search by ID
                defaultIsOpen={schedule._id === inputVal}
                key={schedule._id}
                {...schedule}
              />
            ))}
        </VStack>
      )}
    </VStack>
  );
}
