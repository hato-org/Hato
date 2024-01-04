import { Suspense } from 'react';
import { Box, VStack, Center, Icon, Skeleton, Image } from '@chakra-ui/react';
import { TbArrowNarrowDown, TbExternalLink } from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '@/services/info';
import { useUser } from '@/services/user';
import SettingButton from './Button';
import { MotionCenter } from '@/components/motion';
import ChakraPullToRefresh from '@/components/layout/PullToRefresh';
import Loading from '@/components/common/Loading';
import SettingCategory from './Category';
import Error from '@/components/cards/Error';
import AccountUsername from './account/Username';
import AccountGrade from './account/Grade';
import AccountClass from './account/Class';
import AccountCourse from './account/Course';
import AccountApiKey from './account/ApiKey';

function Account() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isPending: isProfileLoading,
    error: profileError,
  } = useProfile();

  return (
    <MotionCenter
      w="100%"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{
        duration: 0.2,
        type: 'spring',
        damping: 25,
        stiffness: 180,
      }}
      layout
    >
      <ChakraPullToRefresh
        w="100%"
        pb={16}
        onRefresh={async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user'] }),
          ]);
        }}
        refreshingContent={<Loading />}
        pullingContent={
          <Center flexGrow={1} p={4}>
            <Icon as={TbArrowNarrowDown} w={6} h={6} color="gray.500" />
          </Center>
        }
      >
        {/* <VStack w='100%'>
      <Avatar src={user?.avatar} />
      <Text textStyle='title' fontSize='2xl'>{user?.name}</Text>
      <Text textStyle='description'>{user?.email}</Text>
      <Text fontSize='lg' fontWeight='bold' >{user?.contributionCount} pt</Text>
      </VStack> */}

        <VStack spacing={8} align="flex-start" w="100%">
          <SettingCategory title="プロフィール">
            <Skeleton
              w="full"
              rounded="xl"
              sx={{ aspectRatio: '16 / 9' }}
              isLoaded={!isProfileLoading}
            >
              {profileError ? (
                <Error error={profileError} />
              ) : (
                <Box
                  position="relative"
                  rounded="xl"
                  overflow="hidden"
                  onClick={() =>
                    profile && window.open(URL.createObjectURL(profile))
                  }
                >
                  <Center
                    position="absolute"
                    rounded="xl"
                    backdropFilter="auto"
                    opacity={0}
                    transition="all .2s ease"
                    _hover={{
                      cursor: 'pointer',
                      opacity: 1,
                      bg: 'hover',
                      backdropBrightness: 0.9,
                    }}
                    inset={0}
                  >
                    <Icon as={TbExternalLink} boxSize={8} />
                  </Center>
                  <Image
                    w="full"
                    objectFit="contain"
                    src={profile ? URL.createObjectURL(profile) : undefined}
                  />
                </Box>
              )}
            </Skeleton>
            {/* <Profile /> */}
          </SettingCategory>
          <SettingCategory title="アカウント">
            <Suspense fallback={<Loading />}>
              <SettingButton
                htmlFor="modify-username"
                label="アカウント名"
                description="Hato上でのアカウント名。"
              >
                <AccountUsername username={user.name} />
              </SettingButton>
              <SettingButton
                htmlFor="grade-select"
                label="学年"
                description="自分が所属している学年。"
              >
                <AccountGrade />
              </SettingButton>
              <SettingButton
                htmlFor="class-select"
                label="クラス"
                description="自分が所属しているクラス。"
              >
                <AccountClass />
              </SettingButton>
              <SettingButton
                htmlFor="course-select"
                label="講座"
                description="自分が所属している講座。"
              >
                <AccountCourse />
              </SettingButton>
            </Suspense>
          </SettingCategory>
          <SettingCategory title="開発者向け">
            <VStack w="100%" spacing={1}>
              <SettingButton
                label="APIキー"
                description="Hato APIのAPIキーです。"
              >
                <AccountApiKey />
              </SettingButton>
            </VStack>
          </SettingCategory>
        </VStack>
      </ChakraPullToRefresh>
    </MotionCenter>
  );
}

export default Account;
