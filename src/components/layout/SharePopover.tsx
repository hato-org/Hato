import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function SharePopover({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent />
    </Popover>
  );
}
