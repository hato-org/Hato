import {
  Avatar,
  Center,
  HStack,
  VStack,
  Text,
  Heading,
  Spacer,
  Icon,
  StackProps,
  Box,
  Button,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import BottomNavbar from "../components/nav/BottomNavbar";
import { MotionVStack } from "../components/motion";
import Header from "../components/nav/Header";
import SettingButton, {
  SettingButtonProps,
} from "../components/settings/Button";
import { useAuth } from "../modules/auth";
import { Helmet } from "react-helmet-async";

const Settings = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { category } = useParams();

  console.log(category);

  const settingsMenu = useMemo(() => {
    return {
      display: [
        {
          label: "テーマ",
          description: (
            <span>
              背景色を変更できま<s>す。</s>せん。ごめん。
            </span>
          ),
          href: "theme",
        },
      ],
    };
  }, []);

  return (
    <>
    <Helmet>
      <title>設定 - Hato</title>
    </Helmet>
    <Box overflow="hidden">
      <Header>
        <Heading size="md">設定</Heading>
      </Header>
      <Center p={8} flexDir="column">
        <AnimatePresence
          exitBeforeEnter
          onExitComplete={() => console.log("aaa")}
          initial={true}
        >
          {category ? (
            <>
  
              <Outlet key={location.pathname} />
            </>
          ) : (
            <MotionVStack
              key="menu"
              w="100%"
              spacing={8}
              // layout
              initial={{ x: "-100vw", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100vw", opacity: 0 }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.4,
              }}
              layout
            >
              <SettingCategory w="100%" title="アカウント">
                <HStack w="100%" spacing={4} as={RouterLink} to="account">
                  <Avatar src={user?.avatar} size="sm" />
                  <VStack align="flex-start" spacing={0}>
                    <Text fontWeight="bold" fontSize="md" color="gray.500">
                      {user?.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {user?.email}
                    </Text>
                  </VStack>
                  <Spacer />
                  <Icon as={TbChevronRight} />
                </HStack>
              </SettingCategory>
              <SettingCategory w="100%" title="画面表示">
                {settingsMenu.display.map((elem: SettingButtonProps) => (
                  <SettingButton {...elem} key={elem.label} />
                ))}
              </SettingCategory>
              <Button w='100%' variant='ghost' color='red.500' onClick={logout}>
                ログアウト
              </Button>
            </MotionVStack>
          )}
        </AnimatePresence>
      </Center>
      <BottomNavbar />
    </Box>
    </>
  );
};

interface CategoryProps extends StackProps {
  title: string;
}

const SettingCategory = ({ title, children, ...rest }: CategoryProps) => {
  return (
    <VStack align="flex-start" spacing={4} {...rest}>
      <Heading as="h2" size="lg" color="gray.500">
        {title}
      </Heading>
      {children}
    </VStack>
  );
};

export default Settings;
