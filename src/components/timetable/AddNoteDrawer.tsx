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
  Input,
  useToast,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns/esm';
import { AxiosError } from 'axios';
import { useClient } from '../../modules/client';
import { useGradeList, useAllClassList } from '../../hooks/info';
import { useUser } from '../../hooks/user';

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
    const [targetDate, setTargetDate] = useState(date);
    const { data: gradeList } = useGradeList();

    const classListQueries = useAllClassList();
    const classListList = classListQueries.map(
      (classInfoQuery) => classInfoQuery.data
    );
    const [targetClass, setTargetClass] = useState<ClassInfo[]>([]);

    const { mutate } = useMutation<Note, AxiosError>(
      async () =>
        (
          await client.post('/timetable/note', {
            date: startOfDay(targetDate),
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
                year: targetDate.getFullYear(),
                month: targetDate.getMonth() + 1,
                day: targetDate.getDate(),
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
        <DrawerContent borderTopRadius="xl" pb="env(safe-area-inset-bottom)">
          <DrawerHeader>備考の追加</DrawerHeader>
          <DrawerBody px={0}>
            <VStack w="100%" textStyle="title">
              <Accordion
                w="100%"
                allowToggle
                defaultIndex={0}
                border="0px solid var(--chakra-colors-gray-100)"
                rounded="lg"
              >
                <AccordionItem>
                  <AccordionButton px={6}>
                    <Heading size="md">日時</Heading>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={6}>
                    <Input
                      textStyle="title"
                      onChange={(e) => setTargetDate(new Date(e.target.value))}
                      value={format(targetDate, 'yyyy-MM-dd')}
                      variant="flushed"
                      type="date"
                      isInvalid={!targetDate}
                    />
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton px={6}>
                    <Heading size="md">対象</Heading>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={6} py={0}>
                    <Accordion
                      w="100%"
                      // allowMultiple
                      allowToggle
                      // border="0px solid transparent"
                      borderColor="gray.100"
                    >
                      {gradeList?.map((grade) => (
                        <AccordionItem key={grade.name}>
                          <AccordionButton py={1}>
                            <Text textStyle="title">{grade.name}</Text>
                            <Spacer />
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel>
                            <CheckboxGroup>
                              <Wrap>
                                {classListList
                                  .filter(
                                    (classList): classList is ClassList =>
                                      !!classList
                                  )
                                  .filter(
                                    (classList) =>
                                      classList[0].type === grade.type &&
                                      classList[0].grade_num === grade.grade_num
                                  )
                                  .map((classList) =>
                                    classList.map((classInfo) => (
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
                                            ? setTargetClass(
                                                (oldTargetClass) => [
                                                  ...oldTargetClass,
                                                  classInfo,
                                                ]
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
                                                        newTargetClassInfo.grade_num ===
                                                          classInfo.grade_num &&
                                                        newTargetClassInfo.class_num ===
                                                          classInfo.class_num
                                                      )
                                                  );
                                                }
                                              )
                                        }
                                      >
                                        {classInfo.name}
                                      </Checkbox>
                                    ))
                                  )}
                              </Wrap>
                            </CheckboxGroup>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
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
