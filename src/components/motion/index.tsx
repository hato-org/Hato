import { VStack, HStack, Flex, Center } from '@chakra-ui/react';
import { motion } from 'framer-motion';

// @ts-expect-error
export const MotionFlex = motion(Flex);
// @ts-expect-error
export const MotionCenter = motion(Center);
// @ts-expect-error
export const MotionVStack = motion(VStack);
// @ts-expect-error
export const MotionHStack = motion(HStack);
