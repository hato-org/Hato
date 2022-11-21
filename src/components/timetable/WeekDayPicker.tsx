import React, { useState, useMemo } from 'react';
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
  ({
    onWeekSelect,
    onDaySelect,
    week: defaultWeek,
    day: defaultDay,
  }: WeekDayPickerProps) => {
    const weekDays = useMemo(
      () =>
        eachDayOfInterval({
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date()),
        }),
      []
    );

    const [week, setWeek] = useState<Week>(defaultWeek ?? 'A');
    const [day, setDay] = useState<Day>(defaultDay ?? 0);

    console.log('fff');

    return (
      <HStack w="100%">
        <Box w="100%">
          <Menu>
            <MenuButton
              w="100%"
              rounded="lg"
              layerStyle="button"
              textStyle="title"
            >
              <HStack w="100%" px={4} py={2}>
                <Text>{week}週</Text>
                <Spacer />
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList shadow="xl">
              <MenuItem
                textStyle="title"
                onClick={() => {
                  setWeek('A');
                  onWeekSelect('A');
                }}
              >
                A週
              </MenuItem>
              <MenuItem
                textStyle="title"
                onClick={() => {
                  setWeek('B');
                  onWeekSelect('B');
                }}
              >
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
            >
              <HStack w="100%" px={4} py={2}>
                <Text>
                  {format(addDays(startOfWeek(new Date()), day), 'EEEE', {
                    locale: ja,
                  })}
                </Text>
                <Spacer />
                <Icon as={TbChevronDown} />
              </HStack>
            </MenuButton>
            <MenuList shadow="xl">
              {weekDays.map((weekDay) => (
                <MenuItem
                  key={weekDay.toString()}
                  textStyle="title"
                  onClick={() => {
                    setDay(getDay(weekDay));
                    onDaySelect(getDay(weekDay));
                  }}
                >
                  {format(weekDay, 'EEEE', { locale: ja })}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    );
  }
);

export default WeekDayPicker;
