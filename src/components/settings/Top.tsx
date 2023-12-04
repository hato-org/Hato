import { useCallback } from 'react';
import {
  HStack,
  VStack,
  Avatar,
  Text,
  Icon,
  Spacer,
  Button,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  TbActivity,
  TbBrandGithub,
  TbChevronRight,
  TbExternalLink,
} from 'react-icons/tb';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/esm';
import { useSetRecoilState } from 'recoil';
import { useAuth } from '@/modules/auth';
import { useUser } from '@/services/user';
import { tutorialAtom } from '@/store/tutorial';
import { MotionVStack } from '../motion';
import SettingButton from './Button';
import { overlayAtom } from '@/store/overlay';
import SettingCategory from './Category';

function Top() {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const setTutorial = useSetRecoilState(tutorialAtom);
  const setOverlay = useSetRecoilState(overlayAtom);

  const onWhatsNewOpen = useCallback(() => {
    setOverlay((currVal) => ({ ...currVal, whatsNew: true }));
  }, [setOverlay]);

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
      <SettingCategory title="アカウント">
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
          <VStack align="flex-start" spacing={0} minW={0}>
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
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent rounded="xl" bg="panel">
                <ModalHeader>キャッシュを削除しますか？</ModalHeader>
                <ModalBody>
                  <VStack align="flex-start" w="100%" textStyle="title">
                    <Text w="full" textAlign="center">
                      現在アプリ内に保存されている
                      <br />
                      一時データが削除されます
                    </Text>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack w="full" spacing={4}>
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
                </ModalFooter>
              </ModalContent>
            </Modal>
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
            as={Link}
            isExternal
            href={import.meta.env.VITE_REPO_URL}
          >
            GitHub
          </Button>
          <Button as={RouterLink} to="/status" leftIcon={<TbActivity />}>
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

export default Top;
