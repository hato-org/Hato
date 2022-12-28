import { Center, Spinner, SpinnerProps } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { MotionCenter } from '../motion';

const Loading = React.memo(({ ...rest }: SpinnerProps) => (
  <Center w="100%" flexGrow={1} p={4}>
    <Spinner color="blue.400" thickness="3px" {...rest} />
  </Center>
));

export const GlobalLoading = React.memo(() => (
  <AnimatePresence>
    <MotionCenter
      key="global-loading"
      w="100%"
      h="100%"
      position="fixed"
      top={0}
      left={0}
      flexGrow={1}
      // transition="all .2s ease"
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
    >
      <Spinner size="lg" color="blue.400" thickness="3px" />
    </MotionCenter>
  </AnimatePresence>
));

export default Loading;
