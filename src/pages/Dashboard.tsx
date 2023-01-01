import { Box, Heading, HStack, Spacer, Stack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Card from '@/components/layout/Card';
import CardElement from '@/components/cards';
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
    <Box>
      <Helmet>
        <title>ホーム - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header withMenu>
        <HStack w="100%">
          <Heading size="md" ml={2} py={4}>
            ホーム
          </Heading>
          <Spacer />
          {/* <IconButton
            aria-label="Go to settings"
            icon={<Icon as={TbSettings} boxSize={6} />}
            variant="ghost"
            size="lg"
            isRound
            as={RouterLink}
            to="/settings"
          /> */}
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
            queryClient.invalidateQueries(['transit']),
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
    </Box>
  );
}

export default Dashboard;
