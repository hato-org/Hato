import { useCallback } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import {
  HStack,
  VStack,
  Text,
  Icon,
  Spacer,
  Button,
  useDisclosure,
  ButtonGroup,
  Link,
} from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { Link as RouterLink } from 'react-router';
import {
  TbActivity,
  TbBrandGithub,
  TbChevronRight,
  TbExternalLink,
} from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useSetAtom } from 'jotai';
import { useAuth } from '@/modules/auth';
import { useUser } from '@/services/user';
import { tutorialAtom } from '@/store/tutorial';
import { MotionVStack } from '@/components/motion';
import SettingButton from './Button';
import { whatsNewAtom } from '@/store/overlay';
import SettingCategory from './Category';

function Top() {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const setTutorial = useSetAtom(tutorialAtom);
  const setWhatsNew = useSetAtom(whatsNewAtom);

  const onWhatsNewOpen = useCallback(() => {
    setWhatsNew(true);
  }, [setWhatsNew]);

  return (
    <MotionVStack
      w="100%"
      gap={8}
      initial={{ x: '-100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{
        duration: 0.2,
        type: 'spring',
        damping: 25,
        stiffness: 180,
      }}
      layout
    >
      <SettingCategory title="アカウント">
        <HStack p={2} w="100%" gap={4} rounded="xl" asChild layerStyle="button">
          <RouterLink to="account">
            <Avatar src={user?.avatar} size="sm" />
            <VStack align="flex-start" gap={0} minW={0}>
              <Text textStyle="title" fontSize="md">
                {user?.name}
              </Text>
              <Text textStyle="description" fontSize="xs" lineClamp={1}>
                {user?.email}
              </Text>
            </VStack>
            <Spacer />
            <Text textStyle="description" fontWeight="bold" whiteSpace="nowrap">
              {user?.contributionCount} pt
            </Text>
            <Icon as={TbChevronRight} />
          </RouterLink>
        </HStack>
      </SettingCategory>
      <SettingCategory title="画面表示">
        <SettingButton
          label="テーマ"
          description="画面のテーマを変更できます。"
          href="theme"
        />
      </SettingCategory>
      <SettingCategory title="通知">
        <SettingButton
          label="プッシュ通知"
          description="プッシュ通知のオン・オフを設定できます。"
          href="notification"
        />
      </SettingCategory>
      <SettingCategory title="開発者向け">
        <SettingButton
          label="APIドキュメント"
          description="Hato APIについてのドキュメントです。"
          onClick={() => window.open(import.meta.env.VITE_API_DOCS_URL)}
        >
          <Icon as={TbExternalLink} />
        </SettingButton>
      </SettingCategory>
      <SettingCategory title="その他">
        <SettingButton label="リリースノート" onClick={onWhatsNewOpen} />
        <SettingButton label="キャッシュ削除" onClick={onOpen}>
          <>
            <DialogRoot
              placement="center"
              open={isOpen}
              onOpenChange={(e) => !e.open && onClose()}
            >
              <DialogContent rounded="xl" bg="panel">
                <DialogHeader>キャッシュを削除しますか？</DialogHeader>
                <DialogBody>
                  <VStack align="flex-start" w="100%" textStyle="title">
                    <Text w="full" textAlign="center">
                      現在アプリ内に保存されている
                      <br />
                      一時データが削除されます
                    </Text>
                  </VStack>
                </DialogBody>
                <DialogFooter>
                  <HStack w="full" gap={4}>
                    <Button
                      w="full"
                      variant="ghost"
                      rounded="lg"
                      onClick={onClose}
                    >
                      キャンセル
                    </Button>
                    <Button
                      w="full"
                      colorScheme="red"
                      rounded="lg"
                      onClick={() => {
                        setTutorial({
                          ATHS: false,
                          iCal: false,
                          events: false,
                          pin: false,
                        });
                        queryClient.clear();
                        onClose();
                      }}
                    >
                      削除
                    </Button>
                  </HStack>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
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
          <Button asChild>
            <Link
              target="_blank"
              rel="noreferrer"
              href={import.meta.env.VITE_REPO_URL}
            >
              <TbBrandGithub />
              GitHub
            </Link>
          </Button>
          <Button asChild>
            <RouterLink to="/status">
              <TbActivity />
              サービス稼働状況
            </RouterLink>
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

export default Top;
