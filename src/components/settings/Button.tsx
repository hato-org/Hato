import {
  HStack,
  VStack,
  Text,
  Icon,
  StackProps,
  Spacer,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbChevronRight } from 'react-icons/tb';

export interface SettingButtonProps extends StackProps {
  label: string;
  description?: JSX.Element | string;
  href?: string;
  children?: JSX.Element;
}

function SettingButton({
  label,
  description,
  href,
  children,
  ...rest
}: SettingButtonProps) {
  return (
    <HStack
      p={2}
      w="100%"
      as={href ? RouterLink : undefined}
      to={href || ''}
      rounded="xl"
      layerStyle="button"
      {...rest}
    >
      <VStack align="flex-start" spacing={0} flexGrow={1}>
        <Text fontWeight="bold" fontSize="md" textStyle="title">
          {label}
        </Text>
        <Text fontSize="xs" color="gray.400" noOfLines={1}>
          {description}
        </Text>
      </VStack>
      <Spacer />
      {children || <Icon as={TbChevronRight} />}
    </HStack>
  );
}

export default SettingButton;
