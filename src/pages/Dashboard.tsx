import { Center, chakra, Heading, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import PullToRefresh from "react-simple-pull-to-refresh";
import Card from "../components/layout/Card";
import { CardElement } from "../components/cards";
import { Account } from "../components/login/Account";
import BottomNavbar from "../components/nav/BottomNavbar";
import Header from "../components/nav/Header";
import Loading from "../components/common/Loading";
import { TbArrowNarrowDown } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";
import { useSeconds } from "use-seconds";
import { Helmet } from "react-helmet-async";

const ChakraPullToRefresh = chakra(PullToRefresh);

const Dashboard = () => {
  const [date] = useSeconds();

  const formatDate = new Intl.DateTimeFormat([], {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
  const hour = new Date().getHours();
  const greet =
    hour > 0 && hour < 4
      ? "こんばんは"
      : hour >= 4 && hour < 9
      ? "おはようございます"
      : hour >= 9 && hour < 19
      ? "こんにちは"
      : "こんばんは";

  const queryClient = useQueryClient();

  return (
    <>
      <Helmet>
        <title>ホーム - Hato</title>
      </Helmet>
      <Header>
        {/* <Account rounded="xl" /> */}
        <Heading size='md'>ホーム</Heading>
      </Header>
      <ChakraPullToRefresh
        w="100%"
        minH="100vh"
        onRefresh={async () => {
          console.log('refreshing');
          await queryClient.invalidateQueries(['dashboard'])
        }}
        refreshingContent={<Loading />}
        pullDownThreshold={80}
        pullingContent={
          <Center flexGrow={1} p={4}>
            <Icon as={TbArrowNarrowDown} w={6} h={6} color='gray.400' />
          </Center>
        }
      >
        <Stack w="100%" p={4} pb={8} spacing={8}>
          <VStack w="100%" align="flex-start" spacing={1}>
            <Heading as="h2" textStyle="title">
              {greet}
            </Heading>
            <Text fontWeight="bold" textStyle="description">
              {formatDate}
            </Text>
          </VStack>
          <Card w={{ base: "100%" }} border="1px solid" borderColor="gray.100">
            <CardElement.Timetable />
          </Card>
        </Stack>
      </ChakraPullToRefresh>
      <BottomNavbar />
    </>
  );
};

export default Dashboard;
