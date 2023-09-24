import {
  HStack,
  Icon,
  Spacer,
  StackProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import { TbChevronRight } from 'react-icons/tb';

interface PostCategoryButtonProps extends StackProps {
  icon: IconType;
  label: string;
  description: string;
  href: string;
}

function PostCategoryButton({
  icon,
  label,
  description,
  href,
  ...rest
}: PostCategoryButtonProps) {
  return (
    <HStack
      w="100%"
      rounded="xl"
      p={2}
      spacing={0}
      as={RouterLink}
      to={href}
      {...rest}
    >
      <Icon as={icon} w={8} h={8} mx={2} />
      <VStack px={2} spacing={1} align="flex-start">
        <Text textStyle="title" fontSize="lg">
          {label}
        </Text>
        <Text textStyle="description">{description}</Text>
      </VStack>
      <Spacer />
      <Icon as={TbChevronRight} />
    </HStack>
  );
}

export default PostCategoryButton;
