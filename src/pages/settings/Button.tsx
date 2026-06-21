import {
  HStack,
  VStack,
  Text,
  Icon,
  StackProps,
  Spacer,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router';
import { TbChevronRight } from 'react-icons/tb';

export interface SettingButtonProps extends StackProps {
  label: string;
  description?: JSX.Element | string;
  href?: string;
  htmlFor?: string;
  children?: JSX.Element;
}

function SettingButton({
  label,
  description,
  href,
  children,
  ...rest
}: SettingButtonProps) {
  const inner = (
    <>
      <VStack align="flex-start" gap={0} flexGrow={1}>
        <Text fontWeight="bold" fontSize="md" textStyle="title">
          {label}
        </Text>
        <Text fontSize="xs" color="gray.400" lineClamp={1}>
          {description}
        </Text>
      </VStack>
      <Spacer />
      {children || <Icon as={TbChevronRight} />}
    </>
  );

  return href ? (
    <HStack p={2} w="100%" asChild rounded="xl" layerStyle="button" {...rest}>
      <RouterLink to={href}>{inner}</RouterLink>
    </HStack>
  ) : (
    <HStack
      p={2}
      w="100%"
      as="label"
      rounded="xl"
      layerStyle="button"
      {...rest}
    >
      {inner}
    </HStack>
  );
}

export default SettingButton;
