import {
  HStack,
  VStack,
  Avatar,
  Heading,
  Text,
  Icon,
  Spacer,
  Button,
  StackProps,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  UnorderedList,
  ListItem,
  ModalFooter,
  StackDivider,
  Box,
  ButtonGroup,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TbActivity,
  TbBrandGithub,
  TbChevronRight,
  TbExternalLink,
} from 'react-icons/tb';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/esm';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '@/modules/auth';
import { useUser } from '@/hooks/user';
import { tutorialAtom } from '@/store/tutorial';
import { MotionVStack } from '../motion';
import SettingButton from './Button';

function Top() {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const setTutorial = useSetRecoilState(tutorialAtom);
  const { data: totalCache, refetch } = useQuery(
    ['storage'],
    async () => {
      const { usage } = await navigator.storage.estimate();
      return usage ? (usage / 1024 / 1024).toFixed(2) : 0;
    },
    {
      staleTime: 0,
      cacheTime: 0,
      retry: false,
    }
  );

  return (
    <MotionVStack
      w="100%"
      spacing={8}
      initial={{ x: '-100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }}
      layout
    >
      <SettingCategory w="100%" title="アカウント">
        <HStack
          p={2}
          w="100%"
          spacing={4}
          rounded="xl"
          as={RouterLink}
          to="account"
          layerStyle="button"
        >
          <Avatar src={user?.avatar} size="sm" />
          <VStack align="flex-start" spacing={0} flexShrink={1}>
            <Text textStyle="title" fontSize="md">
              {user?.name}
            </Text>
            <Text textStyle="description" fontSize="xs" noOfLines={1}>
              {user?.email}
            </Text>
          </VStack>
          <Spacer />
          <Text textStyle="description" fontWeight="bold" whiteSpace="nowrap">
            {user?.contributionCount} pt
          </Text>
          <Icon as={TbChevronRight} />
        </HStack>
      </SettingCategory>
      <SettingCategory w="100%" title="画面表示">
        <SettingButton
          label="テーマ"
          description="画面のテーマを変更できます。"
          href="theme"
        />
      </SettingCategory>
      <SettingCategory w="100%" title="その他">
        <SettingButton
          label="時間割追加リクエスト"
          description="時間割データの追加をリクエストできます。"
          onClick={() => window.open('https://forms.gle/XcmNLT7PJry9iuxy5')}
        >
          <Icon as={TbExternalLink} />
        </SettingButton>
        <SettingButton label="キャッシュ削除" onClick={onOpen}>
          <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent rounded="xl" bg="panel">
                <ModalHeader>キャッシュを削除しますか？</ModalHeader>
                <ModalBody>
                  <VStack align="flex-start" w="100%" textStyle="title">
                    <Text fontSize="lg">以下のキャッシュが削除されます</Text>
                    <UnorderedList pl={4}>
                      <ListItem>はとボード投稿</ListItem>
                      <ListItem>時間割</ListItem>
                      <ListItem>イベント</ListItem>
                    </UnorderedList>
                    {totalCache && (
                      <Box w="100%">
                        <StackDivider />
                        <Text fontSize="lg">合計 {totalCache} MB</Text>
                      </Box>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack>
                    <Button variant="ghost" rounded="lg" onClick={onClose}>
                      キャンセル
                    </Button>
                    <Button
                      colorScheme="red"
                      rounded="lg"
                      onClick={() => {
                        setTutorial({});
                        queryClient.removeQueries(['timetable']);
                        queryClient.removeQueries(['calendar']);
                        queryClient.removeQueries(['posts']);
                        queryClient.removeQueries(['post']);
                        refetch();
                        onClose();
                      }}
                    >
                      削除
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {totalCache && <Text>{totalCache} MB</Text>}
            <Icon as={TbChevronRight} />
          </>
        </SettingButton>
      </SettingCategory>
      <Button
        w="100%"
        variant="ghost"
        color="red.500"
        onClick={logout}
        rounded="lg"
      >
        ログアウト
      </Button>
      <HStack w="100%" justify="center">
        <ButtonGroup rounded="lg" variant="ghost">
          <Button
            leftIcon={<TbBrandGithub />}
            onClick={() => window.open(import.meta.env.VITE_REPO_URL)}
          >
            GitHub
          </Button>
          <Button
            leftIcon={<TbActivity />}
            onClick={() => window.open(import.meta.env.VITE_STATUSPAGE_URL)}
          >
            サービス稼働状況
          </Button>
        </ButtonGroup>
      </HStack>
      <VStack>
        <Text textStyle="description" color="gray.400">
          Hato (Beta) build {__GIT_COMMIT_HASH__}/{' '}
          {format(new Date(__GIT_COMMIT_TIMESTAMP__), 'yyyy-MM-dd HH:mm')}
        </Text>
      </VStack>
    </MotionVStack>
  );
}

interface CategoryProps extends StackProps {
  title: string;
}

function SettingCategory({ title, children, ...rest }: CategoryProps) {
  return (
    <VStack align="flex-start" spacing={4} {...rest}>
      <Heading as="h2" size="lg" textStyle="title">
        {title}
      </Heading>
      {children}
    </VStack>
  );
}

export default Top;
