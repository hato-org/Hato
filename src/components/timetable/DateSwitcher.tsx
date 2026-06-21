import React, { useRef } from 'react';
import { HStack, IconButton, Input, StackProps } from '@chakra-ui/react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { format } from 'date-fns';

interface DateSwitcherProps extends StackProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateSwitcher = React.memo(
  ({ date, onPrev, onNext, onSelect, ...rest }: DateSwitcherProps) => {
    const inputElement = useRef<HTMLInputElement>(null);

    return (
      <HStack py={2} w="100%" rounded="xl" justify="space-between" {...rest}>
        <IconButton
          aria-label="previous day"
          onClick={onPrev}
          borderRadius="full"
          variant="ghost"
        >
          {<TbChevronLeft />}
        </IconButton>
        <Input
          textStyle="title"
          type="date"
          variant="flushed"
          value={format(date, 'yyyy-MM-dd')}
          onChange={onSelect}
          ref={inputElement}
        />
        <IconButton
          aria-label="next day"
          onClick={onNext}
          borderRadius="full"
          variant="ghost"
        >
          {<TbChevronRight />}
        </IconButton>
      </HStack>
    );
  },
);
DateSwitcher.displayName = 'DateSwitcher';

export default DateSwitcher;
