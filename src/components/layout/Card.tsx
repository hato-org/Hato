import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface CardProps extends BoxProps {}

const Card = React.memo(({ children, ...rest }: CardProps) => (
  <Box rounded="xl" shadow="xl" p={4} {...rest}>
    {children}
  </Box>
));

export default Card;
