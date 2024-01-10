import {
  Button,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  VStack,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { TbDownload } from 'react-icons/tb';
import GradeClassPicker from '../GradeClassPicker';
import { useUserScheduleMutation } from '@/services/timetable';
import { useUser } from '@/services/user';

export function UserScheduleImportModal({
  schedule,
  isOpen,
  onClose,
}: {
  schedule: Omit<UserSchedule, 'owner' | '_id' | 'private'>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const toast = useToast({ position: 'top-right', duration: 1000 * 2 });
  const { data: user } = useUser();
  const { mutate, isPending } = useUserScheduleMutation();

  const [title, setTitle] = useState(schedule.title);
  const [description, setDescription] = useState(schedule.description);
  const [isPrivate, { toggle }] = useBoolean(true);
  const [type, setType] = useState<Type>(schedule.meta.type);
  const [gradeCode, setGradeCode] = useState<GradeCode>(schedule.meta.grade);
  const [classCode, setClassCode] = useState<ClassCode>(schedule.meta.class);
  const [courseCode, setCourseCode] = useState<CourseCode | undefined>(
    schedule.meta.course,
  );

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent rounded="xl" bg="panel">
        <ModalHeader>時間割のインポート</ModalHeader>
        <ModalBody>
          <VStack w="full" gap={8} py={4}>
            <VStack w="full">
              <Input
                variant="flushed"
                size="lg"
                fontWeight="bold"
                placeholder="時間割の名前"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                variant="flushed"
                placeholder="時間割の説明"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </VStack>
            <HStack w="full" px={4}>
              <Text textStyle="title">非公開</Text>
              <Spacer />
              <Switch isChecked={isPrivate} onChange={toggle} />
            </HStack>
            <GradeClassPicker
              direction={{ base: 'column', md: 'row' }}
              defaultType={type}
              defaultGrade={gradeCode}
              defaultClass={classCode}
              defaultCourse={courseCode}
              onGradeSelect={(gradeInfo) => {
                setType(gradeInfo.type);
                setGradeCode(gradeInfo.gradeCode);
              }}
              onClassSelect={(classInfo) => setClassCode(classInfo.classCode)}
              onCourseSelect={(courseInfo) => setCourseCode(courseInfo.code)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            w="full"
            rounded="lg"
            colorScheme="blue"
            leftIcon={<Icon as={TbDownload} />}
            onClick={() => {
              mutate(
                {
                  ...schedule,
                  title,
                  description,
                  owner: user._id,
                  private: isPrivate,
                  meta: {
                    type,
                    grade: gradeCode,
                    class: classCode,
                    course: courseCode,
                  },
                },
                {
                  onSuccess: () => {
                    toast({
                      title: 'インポートしました。',
                      status: 'success',
                    });
                    onClose();
                  },
                  onError: (e) => {
                    toast({
                      title: 'インポートに失敗しました',
                      description: e.name,
                      status: 'error',
                    });
                  },
                },
              );
            }}
            isLoading={isPending}
          >
            インポート
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
