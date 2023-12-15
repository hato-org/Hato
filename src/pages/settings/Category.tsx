import { Heading, StackProps, VStack } from '@chakra-ui/react';

interface CategoryProps extends StackProps {
  title: string;
}

export default function SettingCategory({
  title,
  children,
  ...rest
}: CategoryProps) {
  return (
    <VStack align="flex-start" spacing={2} w="100%" {...rest}>
      <Heading as="h2" size="md" textStyle="title">
        {title}
      </Heading>
      <VStack w="100%" spacing={1}>
        {children}
      </VStack>
    </VStack>
  );
}
