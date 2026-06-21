import React, { useState } from 'react';
import { DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot } from '@/components/ui/drawer';
import { Button, Accordion, Heading, Textarea, VStack, Text, Spacer, CheckboxGroup, Wrap, HStack, Field } from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { toaster } from '@/components/ui/toaster';
import ResizeTextArea from 'react-textarea-autosize';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useGradeList, useAllClassList } from '@/services/info';
import { useAddNoteMutation } from '@/services/timetable';
import { useUser } from '@/services/user';

interface AddNoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const AddNoteDrawer = React.memo(
  ({ isOpen, onClose, date, ...rest }: AddNoteDrawerProps) => {
    const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create(options);
    const { data: user } = useUser();
    const [message, setMessage] = useState('');
    const { data: gradeList } = useGradeList({ enabled: isOpen });
    const classListQueries = useAllClassList({ enabled: isOpen });
    const classListList = classListQueries.flatMap((classInfoQuery) =>
      classInfoQuery.data ? [classInfoQuery.data] : [],
    );
    const [targetClass, setTargetClass] = useState<ClassInfo[]>([]);

    const { mutate, isPending } = useAddNoteMutation();

    return (
      <DrawerRoot placement="bottom" open={isOpen} onOpenChange={(e) => !e.open && (onClose)()} {...rest}>
        <DrawerContent
          borderTopRadius="xl"
          pb="env(safe-area-inset-bottom)"
          bg="panel"
        >
          <DrawerHeader w="full" maxW="container.lg" mx="auto">
            <HStack>
              <Text>備考の追加</Text>
              <Spacer />
              <Text textStyle="description">
                {format(date, 'MM/dd (EEE)', { locale: ja })}
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody w="full" maxW="container.lg" mx="auto" px={0}>
            <VStack w="100%" textStyle="title">
              <Accordion.Root
                w="100%"
                collapsible
                defaultValue={['target']}
                border="0px solid"
                borderColor="border"
                rounded="lg"
              >
                <Accordion.Item value="target">
                  <Accordion.ItemTrigger px={6}>
                    <Heading size="md">対象</Heading>
                    <Spacer />
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody px={4} py={0}>
                      <Accordion.Root
                        w="100%"
                        collapsible
                        borderColor="border"
                      >
                        {gradeList?.map((grade) => {
                          const classList = classListList.find(
                            (clList) =>
                              clList[0].type === grade.type &&
                              clList[0].gradeCode === grade.gradeCode,
                          );
                          const allChecked = classList?.every((classInfo) =>
                            targetClass.some(
                              (targetClassInfo) =>
                                targetClassInfo.type === classInfo.type &&
                                targetClassInfo.gradeCode ===
                                  classInfo.gradeCode &&
                                targetClassInfo.classCode === classInfo.classCode,
                            ),
                          );
                          const isIndeterminate =
                            classList?.some((classInfo) =>
                              targetClass.some(
                                (targetClassInfo) =>
                                  targetClassInfo.type === classInfo.type &&
                                  targetClassInfo.gradeCode ===
                                    classInfo.gradeCode &&
                                  targetClassInfo.classCode ===
                                    classInfo.classCode,
                              ),
                            ) && !allChecked;

                          return (
                            <Accordion.Item key={grade.name} value={grade.name}>
                              <Accordion.ItemTrigger py={1}>
                                <Checkbox
                                  checked={
                                    isIndeterminate
                                      ? 'indeterminate'
                                      : allChecked
                                  }
                                  onCheckedChange={(e) =>
                                    e.checked
                                      ? setTargetClass((oldTargetClass) => [
                                          ...oldTargetClass,
                                          ...(classList ?? []),
                                        ])
                                      : setTargetClass((oldTargetClass) => {
                                          const newTargetClassList = [
                                            ...oldTargetClass,
                                          ];
                                          return newTargetClassList.filter(
                                            (newTargetClassInfo) =>
                                              !classList?.some(
                                                (classInfo) =>
                                                  newTargetClassInfo.type ===
                                                    classInfo.type &&
                                                  newTargetClassInfo.gradeCode ===
                                                    classInfo.gradeCode &&
                                                  newTargetClassInfo.classCode ===
                                                    classInfo.classCode,
                                              ),
                                          );
                                        })
                                  }
                                >
                                  <Text textStyle="title">{grade.name}</Text>
                                </Checkbox>
                                <Spacer />
                                <Accordion.ItemIndicator />
                              </Accordion.ItemTrigger>
                              <Accordion.ItemContent>
                                <Accordion.ItemBody>
                                  <CheckboxGroup>
                                    <Wrap>
                                      {classList?.map((classInfo) => (
                                        <Checkbox
                                          key={classInfo.name}
                                          checked={targetClass.some(
                                            (targetClassInfo) =>
                                              targetClassInfo.type ===
                                                classInfo.type &&
                                              targetClassInfo.gradeCode ===
                                                classInfo.gradeCode &&
                                              targetClassInfo.classCode ===
                                                classInfo.classCode,
                                          )}
                                          onCheckedChange={(e) =>
                                            e.checked
                                              ? setTargetClass(
                                                  (oldTargetClass) => [
                                                    ...oldTargetClass,
                                                    classInfo,
                                                  ],
                                                )
                                              : setTargetClass(
                                                  (oldTargetClass) => {
                                                    const newTargetClassList = [
                                                      ...oldTargetClass,
                                                    ];
                                                    return newTargetClassList.filter(
                                                      (newTargetClassInfo) =>
                                                        !(
                                                          newTargetClassInfo.type ===
                                                            classInfo.type &&
                                                          newTargetClassInfo.gradeCode ===
                                                            classInfo.gradeCode &&
                                                          newTargetClassInfo.classCode ===
                                                            classInfo.classCode
                                                        ),
                                                    );
                                                  },
                                                )
                                          }
                                        >
                                          {classInfo.name}
                                        </Checkbox>
                                      ))}
                                    </Wrap>
                                  </CheckboxGroup>
                                </Accordion.ItemBody>
                              </Accordion.ItemContent>
                            </Accordion.Item>
                          );
                        })}
                      </Accordion.Root>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
                <Accordion.Item value="description">
                  <Accordion.ItemTrigger px={6}>
                    <Heading size="md">説明</Heading>
                    <Spacer />
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody px={6}>
                      <Field.Root invalid={!message}>
                        <Textarea
                          asChild
                          resize="none"
                          variant="flushed"
                          minH="unset"
                        >
                          <ResizeTextArea
                            value={message}
                            placeholder="説明"
                            maxRows={5}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </Textarea>
                      </Field.Root>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              </Accordion.Root>
            </VStack>
          </DrawerBody>
          <DrawerFooter w="full" maxW="container.lg" mx="auto">
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() =>
                mutate(
                  {
                    date,
                    owner: user.email,
                    message,
                    target: targetClass,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        type: 'success',
                        title: '追加しました。',
                      });
                      onClose();
                    },
                    onError: (error) => {
                      toast({
                        type: 'error',
                        title: '追加に失敗しました。',
                        description: error.message,
                      });
                    },
                  },
                )
              }
              disabled={!date || !message || !targetClass.length}
              loading={isPending}
            >
              追加
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    );
  },
);
AddNoteDrawer.displayName = 'AddNoteDrawer';

export default AddNoteDrawer;
