import React, { useEffect, useState } from 'react';
import {
  Button,
  Heading,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Switch,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { format, startOfDay } from 'date-fns/esm';
import { ja } from 'date-fns/locale';
import { TbX } from 'react-icons/tb';
import WeekDayPicker from './WeekDayPicker';
import { useDivision, useDivisionMutation } from '@/services/timetable';

interface DivisionEditorProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

const DivisionEditor = React.memo(
  ({ date, isOpen, onClose }: DivisionEditorProps) => {
    const toast = useToast({
      position: 'top-right',
      duration: 1000,
    });

    const [division, setDivision] = useState<Partial<Division>>({
      date: startOfDay(date),
      week: undefined,
      day: date.getDay() as Day,
      irregular: false,
    });

    const { data: currentDivision } = useDivision({ date });

    const { mutate, isPending } = useDivisionMutation();

    useEffect(() => {
      setDivision({
        date: startOfDay(date),
        week: undefined,
        day: date.getDay() as Day,
        irregular: false,
        ...currentDivision,
      });
    }, [date, currentDivision]);

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent rounded="xl" bg="panel">
          <ModalHeader>
            <HStack align="center">
              <Text>日課の編集</Text>
              <Spacer />
              <Text textStyle="description">
                {format(date, 'MM/dd (E)', { locale: ja })}
              </Text>
              <IconButton
                aria-label="close modal"
                icon={<Icon as={TbX} boxSize={4} />}
                variant="ghost"
                rounded="lg"
                size="sm"
                onClick={onClose}
              />
            </HStack>
          </ModalHeader>
          <ModalBody>
            <VStack align="stretch">
              <Heading size="md">日課</Heading>
              <WeekDayPicker
                week={division.week}
                day={division.day}
                onWeekSelect={(week) =>
                  setDivision((val) => ({ ...val, week }))
                }
                onDaySelect={(day) => setDivision((val) => ({ ...val, day }))}
              />
              <HStack py={4} px={4}>
                <Text textStyle="title">特編</Text>
                <Spacer />
                <Switch
                  isChecked={division.irregular}
                  onChange={(e) =>
                    setDivision((val) => ({
                      ...val,
                      irregular: e.target.checked,
                    }))
                  }
                />
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              w="100%"
              colorScheme="blue"
              rounded="lg"
              onClick={() => {
                if (
                  division.date &&
                  division.week &&
                  division.day !== undefined &&
                  division.irregular !== undefined
                )
                  mutate(
                    {
                      date: division.date,
                      week: division.week,
                      day: division.day,
                      irregular: division.irregular,
                    },
                    {
                      onSuccess: () => {
                        onClose();
                        toast({
                          title: '更新しました。',
                          status: 'success',
                        });
                      },
                      onError: (error) => {
                        toast({
                          title: '更新に失敗しました。',
                          description: error.message,
                          status: 'error',
                        });
                      },
                    },
                  );
              }}
              isDisabled={
                !(division.date && division.week && division.day !== undefined)
              }
              isLoading={isPending}
            >
              更新
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);

export default DivisionEditor;
