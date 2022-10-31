import {
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbSettings } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/layout/Card';
import CardElement from '@/components/cards';
import BottomNavbar from '@/components/nav/BottomNavbar';
import Header from '@/components/nav/Header';

function Dashboard() {
  // const [date] = useSeconds();

  // const formatDate = new Intl.DateTimeFormat([], {
  //   dateStyle: 'full',
  //   timeStyle: 'short',
  // }).format(date);
  // const hour = new Date().getHours();
  // const greet =
  //   hour > 0 && hour < 4
  //     ? 'こんばんは'
  //     : hour >= 4 && hour < 9
  //     ? 'おはようございます'
  //     : hour >= 9 && hour < 19
  //     ? 'こんにちは'
  //     : 'こんばんは';

  const queryClient = useQueryClient();

  return (
    <>
      <Helmet>
        <title>ホーム - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%" px={2}>
          {/* <Image src='./hato.png' h={8} px={2} fallback={<SkeletonCircle size='8' px={2} />} /> */}
          {/* <Avatar src={user?.avatar} size='sm' ml={2} /> */}
          <Heading size="md" ml={4} py={4}>
            ホーム
          </Heading>
          <Spacer />
          <IconButton
            aria-label="Go to settings"
            icon={<Icon as={TbSettings} w={6} h={6} />}
            variant="ghost"
            size="lg"
            isRound
            as={RouterLink}
            to="/settings"
          />
        </HStack>
      </Header>
      <ChakraPullToRefresh
        w="100%"
        minH="100vh"
        mb={16}
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries(['timetable']),
            queryClient.invalidateQueries(['calendar']),
            queryClient.invalidateQueries(['posts']),
          ]);
        }}
      >
        <Stack flex={1} p={4} pb={16} spacing={8}>
          {/* <VStack w="100%" align="flex-start" spacing={1}>
            <Heading as="h2" textStyle="title">
              {greet}
            </Heading>
            <Text fontWeight="bold" textStyle="description">
              {formatDate}
            </Text>
          </VStack> */}
          <CardElement.Info />
          <Card w={{ base: '100%' }}>
            <CardElement.Timetable />
          </Card>
          <Card w="100%">
            <CardElement.Events />
          </Card>
          <Card w="100%">
            <CardElement.Hatoboard />
          </Card>
        </Stack>
      </ChakraPullToRefresh>
      <BottomNavbar />
    </>
  );
}

export default Dashboard;
