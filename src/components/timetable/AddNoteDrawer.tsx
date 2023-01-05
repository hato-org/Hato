import React, { useState } from 'react';
import {
  Button,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Textarea,
  VStack,
  Text,
  Spacer,
  CheckboxGroup,
  Checkbox,
  Wrap,
  useToast,
  HStack,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns/esm';
import { ja } from 'date-fns/esm/locale';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';
import { useGradeList, useAllClassList } from '@/hooks/info';
import { useUser } from '@/hooks/user';

interface AddNoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const AddNoteDrawer = React.memo(
  ({ isOpen, onClose, date, ...rest }: AddNoteDrawerProps) => {
    const toast = useToast({
      position: 'top-right',
      variant: 'left-accent',
    });
    const { data: user } = useUser();
    const { client } = useClient();
    const queryClient = useQueryClient();
    const [message, setMessage] = useState('');
    const { data: gradeList } = useGradeList({ enabled: isOpen });
    const classListQueries = useAllClassList({ enabled: isOpen });
    const classListList = classListQueries.flatMap((classInfoQuery) =>
      classInfoQuery.data ? [classInfoQuery.data] : []
    );
    const [targetClass, setTargetClass] = useState<ClassInfo[]>([]);

    const { mutate } = useMutation<Note, AxiosError>(
      async () =>
        (
          await client.post('/timetable/note', {
            date: startOfDay(date),
            target: targetClass,
            message,
            owner: user.email,
          })
        ).data,
      {
        onSuccess: (note) => {
          toast({
            status: 'success',
            title: '追加しました。',
          });
          queryClient.setQueryData<Note[]>(
            [
              'timetable',
              'note',
              {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
              },
            ],
            (oldNotes) => [...(oldNotes ?? []), note]
          );
          onClose();
        },
        onError: (error) => {
          toast({
            status: 'error',
            title: '追加に失敗しました。',
            description: error.message,
          });
        },
      }
    );

    return (
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={onClose}
        autoFocus={false}
        {...rest}
      >
        <DrawerOverlay />
        <DrawerContent
          borderTopRadius="xl"
          pb="env(safe-area-inset-bottom)"
          bg="panel"
        >
          <DrawerHeader>
            <HStack>
              <Text>備考の追加</Text>
              <Spacer />
              <Text textStyle="description">
                {format(date, 'MM/dd (EEE)', { locale: ja })}
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody px={0}>
            <VStack w="100%" textStyle="title">
              <Accordion
                w="100%"
                allowToggle
                defaultIndex={0}
                border="0px solid"
                borderColor="border"
                rounded="lg"
              >
                <AccordionItem>
                  <AccordionButton px={6}>
                    <Heading size="md">対象</Heading>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={4} py={0}>
                    <Accordion
                      w="100%"
                      // allowMultiple
                      allowToggle
                      // border="0px solid transparent"
                      borderColor="border"
                    >
                      {gradeList?.map((grade) => {
                        const classList = classListList.find(
                          (clList) =>
                            clList[0].type === grade.type &&
                            clList[0].grade_num === grade.grade_num
                        );
                        const allChecked = classList?.every((classInfo) =>
                          targetClass.some(
                            (targetClassInfo) =>
                              targetClassInfo.type === classInfo.type &&
                              targetClassInfo.grade_num ===
                                classInfo.grade_num &&
                              targetClassInfo.class_num === classInfo.class_num
                          )
                        );
                        const isIndeterminate =
                          classList?.some((classInfo) =>
                            targetClass.some(
                              (targetClassInfo) =>
                                targetClassInfo.type === classInfo.type &&
                                targetClassInfo.grade_num ===
                                  classInfo.grade_num &&
                                targetClassInfo.class_num ===
                                  classInfo.class_num
                            )
                          ) && !allChecked;

                        return (
                          <AccordionItem key={grade.name}>
                            <AccordionButton py={1}>
                              <Checkbox
                                isChecked={allChecked}
                                isIndeterminate={isIndeterminate}
                                onChange={(e) =>
                                  e.target.checked
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
                                                newTargetClassInfo.grade_num ===
                                                  classInfo.grade_num &&
                                                newTargetClassInfo.class_num ===
                                                  classInfo.class_num
                                            )
                                        );
                                      })
                                }
                              >
                                <Text textStyle="title">{grade.name}</Text>
                              </Checkbox>
                              <Spacer />
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                              <CheckboxGroup>
                                <Wrap>
                                  {classList?.map((classInfo) => (
                                    <Checkbox
                                      key={classInfo.name}
                                      isChecked={targetClass.some(
                                        (targetClassInfo) =>
                                          targetClassInfo.type ===
                                            classInfo.type &&
                                          targetClassInfo.grade_num ===
                                            classInfo.grade_num &&
                                          targetClassInfo.class_num ===
                                            classInfo.class_num
                                      )}
                                      onChange={(e) =>
                                        e.target.checked
                                          ? setTargetClass((oldTargetClass) => [
                                              ...oldTargetClass,
                                              classInfo,
                                            ])
                                          : setTargetClass((oldTargetClass) => {
                                              const newTargetClassList = [
                                                ...oldTargetClass,
                                              ];
                                              return newTargetClassList.filter(
                                                (newTargetClassInfo) =>
                                                  !(
                                                    newTargetClassInfo.type ===
                                                      classInfo.type &&
                                                    newTargetClassInfo.grade_num ===
                                                      classInfo.grade_num &&
                                                    newTargetClassInfo.class_num ===
                                                      classInfo.class_num
                                                  )
                                              );
                                            })
                                      }
                                    >
                                      {classInfo.name}
                                    </Checkbox>
                                  ))}
                                </Wrap>
                              </CheckboxGroup>
                            </AccordionPanel>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton px={6}>
                    <Heading size="md">説明</Heading>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={6}>
                    <Textarea
                      value={message}
                      placeholder="説明"
                      as={ResizeTextArea}
                      resize="none"
                      variant="flushed"
                      minH="unset"
                      maxRows={5}
                      onChange={(e) => setMessage(e.target.value)}
                      isInvalid={!message}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() => mutate()}
              isDisabled={!date || !message || !targetClass.length}
            >
              追加
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default AddNoteDrawer;
