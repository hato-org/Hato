import { Box, BoxProps } from "@chakra-ui/react";

interface CardProps extends BoxProps {
	
}

const Card = ({ children, ...rest }: CardProps) => {


	return (
		<Box rounded='xl' shadow='xl' p={4} {...rest}>
			{children}
		</Box>
	)
}

export default Card;