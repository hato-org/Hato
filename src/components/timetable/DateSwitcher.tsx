import { useRef } from 'react';
import { HStack, IconButton, Input } from '@chakra-ui/react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { format } from 'date-fns/esm';

interface DateSwitcherProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DateSwitcher({ date, onPrev, onNext, onSelect }: DateSwitcherProps) {
  const inputElement = useRef<HTMLInputElement>(null);

  return (
    <HStack py={2} w="100%" rounded="xl" justify="space-between">
      <IconButton
        aria-label="previous day"
        icon={<TbChevronLeft />}
        onClick={onPrev}
        isRound
        variant="ghost"
      />
      <Input
        textStyle="title"
        type="date"
        variant="flushed"
        value={format(date, 'yyyy-MM-dd')}
        onChange={onSelect}
        ref={inputElement}
      />
      {/* <Button variant='ghost' rounded='lg' onClick={() => inputElement.current?.click()} >{format(date, 'yyyy/MM/dd')}</Button> */}
      <IconButton
        aria-label="next day"
        icon={<TbChevronRight />}
        onClick={onNext}
        isRound
        variant="ghost"
      />
    </HStack>
  );
}

export default DateSwitcher;
