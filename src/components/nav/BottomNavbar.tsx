import { HStack, Icon, Center } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { TbHome, TbSettings } from "react-icons/tb";
import { useMemo } from "react";

const BottomNavbar = () => {
  const location = useLocation();

  const menu = useMemo(
    () => [
      {
        icon: TbHome,
        label: "ホーム",
        href: "/",
      },
      {
        icon: TbSettings,
        label: "設定",
        href: "/settings",
      },
    ],
    []
  );

  return (
    <HStack
      w="100%"
      py={2}
      position='fixed'
      bottom={0}
      justify="space-around"
      shadow="xl"
      bg='bg'
      borderTop="1px solid"
      borderColor="gray.100"
    >
      {menu.map(({ icon, label, href }) => (
        <Center w="100%" flexGrow={1} as={Link} to={href} key={label}>
          <Icon
            as={icon}
            w={8}
            h={8}
            color={location.pathname === href ? "blue.300" : "gray.500"}
          />
        </Center>
      ))}
    </HStack>
  );
};

export default BottomNavbar;
