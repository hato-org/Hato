import React, { useMemo } from 'react';
import {
  Box,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { TbChevronDown } from 'react-icons/tb';
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  startOfWeek,
} from 'date-fns/esm';
import { ja } from 'date-fns/locale';

interface WeekDayPickerProps {
  onWeekSelect: (week: Week) => void;
  onDaySelect: (day: Day) => void;
  week?: Week;
  day?: Day;
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
          <Menu>
            <MenuButton
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
            </MenuButton>
            <MenuList shadow="xl" rounded="xl">
              <MenuItem textStyle="title" onClick={() => onWeekSelect('A')}>
                A週
              </MenuItem>
              <MenuItem textStyle="title" onClick={() => onWeekSelect('B')}>
                B週
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Box w="100%">
          <Menu>
            <MenuButton
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
            </MenuButton>
            <MenuList shadow="xl" rounded="xl">
              {weekDays.map((weekDay) => (
                <MenuItem
                  key={weekDay.toString()}
                  textStyle="title"
                  onClick={() => onDaySelect(getDay(weekDay))}
                >
                  {format(weekDay, 'EEEE', { locale: ja })}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    );
  },
);

export default WeekDayPicker;
