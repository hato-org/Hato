import { HStack, Icon, Spacer, Text, VStack } from '@chakra-ui/react';
import { TbChevronRight } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router-dom';

interface LibraryCategoryButtonProps {
  icon: JSX.Element;
  label: string;
  description: string;
  href: string;
}

export default function LibraryCategoryButton({
  icon,
  label,
  description,
  href,
}: LibraryCategoryButtonProps) {
  return (
    <HStack
      w="100%"
      rounded="xl"
      layerStyle="button"
      p={4}
      spacing={6}
      as={RouterLink}
      to={href}
    >
      {icon}
      <VStack align="flex-start" spacing={1}>
        <Text textStyle="title">{label}</Text>
        <Text textStyle="description" fontSize="xs" noOfLines={1}>
          {description}{' '}
        </Text>
      </VStack>
      <Spacer />
      <Icon as={TbChevronRight} />
    </HStack>
  );
}
