import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const Card__ = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...rest }: BoxProps, ref) => (
    <Box
      bg="panel"
      transitionProperty="box-shadow, border, background-color"
      transitionDuration=".2s"
      transitionTimingFunction="ease"
      rounded="xl"
      shadow="xl"
      p={4}
      border="1px solid"
      borderColor="border"
      _hover={{ shadow: '2xl' }}
      ref={ref}
      {...rest}
    >
      {children}
    </Box>
  ),
);
Card__.displayName = 'Card';

const Card = React.memo(Card__);

export default Card;
