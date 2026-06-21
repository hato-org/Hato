import React, { useMemo } from 'react';
import { Box, Button, HStack, Icon, Spacer, Text } from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/menu';
import { TbChevronDown } from 'react-icons/tb';
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  startOfWeek,
} from 'date-fns';
import { ja } from 'date-fns/locale';

interface WeekDayPickerProps {
  onWeekSelect: (week: Week) => void;
  onDaySelect: (day: number) => void;
  week?: Week;
  day?: number;
}

const WeekDayPicker = React.memo(
  ({ onWeekSelect, onDaySelect, week, day }: WeekDayPickerProps) => {
    const weekDays = useMemo(
      () =>
        eachDayOfInterval({
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date()),
        }),
      [],
    );

    return (
      <HStack w="100%">
        <Box w="100%">
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="plain"
                w="100%"
                rounded="lg"
                layerStyle="button"
                textStyle="title"
                borderColor={week ? 'border' : 'invalid'}
              >
                <HStack w="100%" px={4} py={2}>
                  <Text>{week ? `${week}週` : '未設定'}</Text>
                  <Spacer />
                  <Icon as={TbChevronDown} />
                </HStack>
              </Button>
            </MenuTrigger>
            <MenuContent shadow="xl" rounded="xl">
              <MenuItem
                value="A"
                textStyle="title"
                onClick={() => onWeekSelect('A')}
              >
                A週
              </MenuItem>
              <MenuItem
                value="B"
                textStyle="title"
                onClick={() => onWeekSelect('B')}
              >
                B週
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </Box>
        <Box w="100%">
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="plain"
                w="100%"
                rounded="lg"
                layerStyle="button"
                textStyle="title"
                borderColor={day !== undefined ? 'border' : 'invalid'}
              >
                <HStack w="100%" px={4} py={2}>
                  <Text>
                    {day !== undefined
                      ? format(addDays(startOfWeek(new Date()), day), 'EEEE', {
                          locale: ja,
                        })
                      : '未設定'}
                  </Text>
                  <Spacer />
                  <Icon as={TbChevronDown} />
                </HStack>
              </Button>
            </MenuTrigger>
            <MenuContent shadow="xl" rounded="xl">
              {weekDays.map((weekDay) => (
                <MenuItem
                  key={weekDay.toString()}
                  value={weekDay.toString()}
                  textStyle="title"
                  onClick={() => onDaySelect(getDay(weekDay))}
                >
                  {format(weekDay, 'EEEE', { locale: ja })}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>
        </Box>
      </HStack>
    );
  },
);
WeekDayPicker.displayName = 'WeekDayPicker';

export default WeekDayPicker;
