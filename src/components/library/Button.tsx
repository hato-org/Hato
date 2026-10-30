import { HStack, Icon, Spacer, Text, VStack } from '@chakra-ui/react';
import { TbChevronRight } from 'react-icons/tb';
import { Link as RouterLink } from 'react-router';

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
    <HStack w="100%" rounded="xl" layerStyle="button" p={4} gap={6} asChild>
      <RouterLink to={href}>
        {icon}
        <VStack align="flex-start" gap={1}>
          <Text textStyle="title">{label}</Text>
          <Text textStyle="description" fontSize="xs" lineClamp={1}>
            {description}{' '}
          </Text>
        </VStack>
        <Spacer />
        <Icon as={TbChevronRight} />
      </RouterLink>
    </HStack>
  );
}
