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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfDay } from 'date-fns/esm';
import { ja } from 'date-fns/locale';
import { TbX } from 'react-icons/tb';
import { AxiosError } from 'axios';
import { useClient } from '@/modules/client';
import WeekDayPicker from './WeekDayPicker';
import { useDivision } from '@/hooks/timetable';

interface DivisionEditorProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

const DivisionEditor = React.memo(
  ({ date, isOpen, onClose }: DivisionEditorProps) => {
    const { client } = useClient();
    const queryClient = useQueryClient();
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

    const { mutate, isLoading } = useMutation<Division, AxiosError>(
      async () => (await client.post('/timetable/division', division)).data,
      {
        onSuccess: (newDivision) => {
          queryClient.setQueryData(
            [
              'timetable',
              'division',
              {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
              },
            ],
            newDivision,
          );
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
              onClick={() => mutate()}
              isDisabled={
                !(division.date && division.week && division.day !== undefined)
              }
              isLoading={isLoading}
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
