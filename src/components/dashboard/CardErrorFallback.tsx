import { Center, VStack, Icon, Text } from '@chakra-ui/react';
import { TbAlertCircle } from 'react-icons/tb';
import { FallbackProps } from 'react-error-boundary';

export default function CardErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <Center w="100%" py={4}>
      <VStack>
        <Icon as={TbAlertCircle} w={16} h={16} color="warning" />
        <Text textStyle="description" align="center">
          {error.message}
        </Text>
        <Text textStyle="title" align="center">
          カードの表示中にエラーが発生しました
        </Text>
        <Text
          as="button"
          textStyle="link"
          fontWeight="bold"
          onClick={resetErrorBoundary}
        >
          再試行
        </Text>
      </VStack>
    </Center>
  );
}
