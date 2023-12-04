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
import { format } from 'date-fns/esm';
import { ja } from 'date-fns/esm/locale';
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
    const toast = useToast({
      position: 'top-right',
      variant: 'left-accent',
    });
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
                                          targetClassInfo.gradeCode ===
                                            classInfo.gradeCode &&
                                          targetClassInfo.classCode ===
                                            classInfo.classCode,
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
                                                    newTargetClassInfo.gradeCode ===
                                                      classInfo.gradeCode &&
                                                    newTargetClassInfo.classCode ===
                                                      classInfo.classCode
                                                  ),
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
                        status: 'success',
                        title: '追加しました。',
                      });
                      onClose();
                    },
                    onError: (error) => {
                      toast({
                        status: 'error',
                        title: '追加に失敗しました。',
                        description: error.message,
                      });
                    },
                  },
                )
              }
              isDisabled={!date || !message || !targetClass.length}
              isLoading={isPending}
            >
              追加
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
);

export default AddNoteDrawer;
