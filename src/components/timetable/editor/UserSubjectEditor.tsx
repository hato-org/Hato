import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useUserSubject, useUserSubjectMutation } from '@/services/timetable';
import { useUser } from '@/services/user';

export default function UserSubjectEditor({
  isOpen,
  onClose,
  subjectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  subjectId?: string | null;
}) {
  const toast = useToast({
    position: 'top-right',
  });
  const { data: user } = useUser();

  const { data } = useUserSubject(subjectId ?? '', { enabled: !!subjectId });

  const { mutate } = useUserSubjectMutation();

  const [subject, setSubject] = useState<Partial<UserSubject>>({
    owner: user._id,
  });

  useEffect(() => {
    if (data) setSubject(data);
  }, [data]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => {
        if (subject.name && subject.owner)
          mutate(subject as UserSubject, {
            onError: (error) => {
              toast({
                status: 'error',
                title: 'エラーが発生しました',
                description: error.message,
              });
            },
          });
        onClose();
      }}
      placement="bottom"
    >
      <DrawerOverlay zIndex={1400} />
      <DrawerContent
        zIndex={1500}
        roundedTop="xl"
        bg="panel"
        pb="env(safe-area-inset-bottom)"
      >
        <DrawerCloseButton top={4} right={4} />
        <DrawerHeader>教科の編集</DrawerHeader>
        <DrawerBody>
          <VStack align="flex-start" spacing={4}>
            <Text textStyle="title">教科名</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={data?.name}
              isInvalid={!subject?.name}
              onChange={(e) =>
                setSubject((userSubject) => ({
                  ...userSubject,
                  name: (e.target.value || data?.name) ?? '',
                }))
              }
            />
            <Text textStyle="title">教科名（略称）</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={data?.short_name}
              onChange={(e) =>
                setSubject((userSubject) => ({
                  ...userSubject,
                  short_name: (e.target.value || data?.short_name) ?? '',
                }))
              }
            />
            <Text textStyle="title">教師</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={data?.teacher}
              onChange={(e) =>
                setSubject((userSubject) => ({
                  ...userSubject,
                  teacher: e.target.value || data?.teacher,
                }))
              }
            />
            <Text textStyle="title">場所</Text>
            <Input
              textStyle="title"
              variant="flushed"
              placeholder={data?.location}
              onChange={(e) =>
                setSubject((userSubject) => ({
                  ...userSubject,
                  location: e.target.value || data?.location,
                }))
              }
            />
          </VStack>
        </DrawerBody>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
