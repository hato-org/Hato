import React, { useEffect, useState } from 'react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Button, Heading, HStack, Icon, IconButton, Spacer, Switch, Text, VStack } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { format, startOfDay } from 'date-fns';
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
    const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1000, ...options });

    const [division, setDivision] = useState<Partial<Division>>({
      date: startOfDay(date),
      week: undefined,
      day: date.getDay(),
      irregular: false,
    });

    const { data: currentDivision } = useDivision({ date });

    const { mutate, isPending } = useDivisionMutation();

    useEffect(() => {
      setDivision({
        date: startOfDay(date),
        week: undefined,
        day: date.getDay(),
        irregular: false,
        ...currentDivision,
      });
    }, [date, currentDivision]);

    return (
      <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && (onClose)()}>
        <DialogContent rounded="xl" bg="panel">
          <DialogHeader>
            <HStack align="center">
              <Text>日課の編集</Text>
              <Spacer />
              <Text textStyle="description">
                {format(date, 'MM/dd (E)', { locale: ja })}
              </Text>
              <IconButton
                aria-label="close modal"
                variant="ghost"
                rounded="lg"
                size="sm"
                onClick={onClose}
              >{<Icon as={TbX} boxSize={4} />}</IconButton>
            </HStack>
          </DialogHeader>
          <DialogBody>
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
          </DialogBody>
          <DialogFooter>
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
                          type: 'success',
                        });
                      },
                      onError: (error) => {
                        toast({
                          title: '更新に失敗しました。',
                          description: error.message,
                          type: 'error',
                        });
                      },
                    },
                  );
              }}
              disabled={
                !(division.date && division.week && division.day !== undefined)
              }
              loading={isPending}
            >
              更新
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  },
);
DivisionEditor.displayName = 'DivisionEditor';

export default DivisionEditor;
