import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const Card = React.memo(({ children, ...rest }: BoxProps) => (
  <Box
    bg="panel"
    transition="all .2s ease"
    rounded="xl"
    shadow="xl"
    p={4}
    border="1px solid"
    borderColor="border"
    _hover={{ shadow: '2xl' }}
    {...rest}
  >
    {children}
  </Box>
));

export default Card;
