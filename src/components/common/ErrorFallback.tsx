import { FallbackProps } from 'react-error-boundary';
import { Center, Code, Flex, VStack } from '@chakra-ui/react';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {

	return (
		<Center h='100vh'>
			<VStack>
				<Code>{error.message}</Code>
			</VStack>
		</Center>
	)
}