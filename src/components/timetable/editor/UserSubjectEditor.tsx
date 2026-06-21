import { useState } from 'react';
import {
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from '@/components/ui/drawer';
import { Button, Field, Input, Text, VStack } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { useUserSubjectMutation } from '@/services/timetable';
import { useUser } from '@/services/user';
import { useUserScheduleContext } from './context';

export default function UserSubjectEditor({
  isOpen,
  onClose,
  subject,
}: {
  isOpen: boolean;
  onClose: () => void;
  subject?: UserSubject;
}) {
  const [, setSchedule] = useUserScheduleContext();
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create(options);
  const { data: user } = useUser();
  const [name, setName] = useState(subject?.name);
  const [shortName, setShortname] = useState(subject?.short_name);
  // const [description, setDescription] = useState(subject?.description);
  const [teacher, setTeacher] = useState(subject?.teacher);
  const [location, setLocation] = useState(subject?.location);

  const { mutate, isPending } = useUserSubjectMutation();

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="bottom"
    >
      <DrawerContent
        zIndex={1500}
        roundedTop="xl"
        bg="panel"
        pb="env(safe-area-inset-bottom)"
      >
        <DrawerCloseTrigger top={4} right={4} />
        <DrawerHeader>教科の編集</DrawerHeader>
        <DrawerBody>
          <VStack align="flex-start" gap={4}>
            <Text textStyle="title">教科名</Text>
            <Field.Root invalid={!name}>
              <Input
                textStyle="title"
                variant="flushed"
                placeholder={subject?.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field.Root>
            <Text textStyle="title">教科名（略称）</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={subject?.short_name}
              onChange={(e) => setShortname(e.target.value || undefined)}
            />
            <Text textStyle="title">教師</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={subject?.teacher}
              onChange={(e) => setTeacher(e.target.value || undefined)}
            />
            <Text textStyle="title">場所</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={subject?.location}
              onChange={(e) => setLocation(e.target.value || undefined)}
            />
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            w="full"
            colorScheme="blue"
            rounded="lg"
            disabled={!(name && subject)}
            loading={isPending}
            onClick={() => {
              if (name && subject)
                mutate(
                  {
                    ...subject,
                    // if the owner is different, create new subject
                    _id: subject.owner === user._id ? subject._id : undefined,
                    owner: user._id,
                    name,
                    short_name: shortName,
                    teacher,
                    location,
                  },
                  {
                    onSuccess: (res) => {
                      // replace subject to user-modified one
                      if (res._id !== subject._id)
                        setSchedule((oldSchedule) => ({
                          ...oldSchedule,
                          schedules: {
                            A: oldSchedule.schedules.A.map((daySchedule) =>
                              daySchedule.map((subj) =>
                                subj.subjectId === subject._id
                                  ? { ...subj, subjectId: res._id! }
                                  : subj,
                              ),
                            ),
                            B: oldSchedule.schedules.B.map((daySchedule) =>
                              daySchedule.map((subj) =>
                                subj.subjectId === subject._id
                                  ? { ...subj, subjectId: res._id! }
                                  : subj,
                              ),
                            ),
                          },
                        }));
                      onClose();
                    },
                    onError: (error) => {
                      toast({
                        type: 'error',
                        title: 'エラーが発生しました',
                        description: error.message,
                      });
                    },
                  },
                );
            }}
          >
            更新
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}
