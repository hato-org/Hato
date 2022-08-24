import { Center, CenterProps } from "@chakra-ui/react";

const Header = ({ children }: CenterProps) => {
  return (
    <Center
      position="sticky"
      top={0}
      py={4}
			mb={4}
      borderBottom="1px solid"
      borderColor="gray.100"
			bg='white'
			shadow='xl'
      zIndex={1}
    >
      {children}
    </Center>
  );
};

export default Header;
