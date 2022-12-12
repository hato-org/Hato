import { useCallback } from 'react';
import { Center, VStack, Icon, Text, IconButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbBulb, TbInfoCircle, TbX } from 'react-icons/tb';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useUser } from '@/hooks/user';
import Card from '../layout/Card';
import { tutorialAtom, tutorialModalAtom } from '@/store/tutorial';

function Info() {
  const { data: user } = useUser();
  const setTutorialModal = useSetRecoilState(tutorialModalAtom);
  const onATHSOpen = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, ATHS: true })),
    [setTutorialModal]
  );
  const isInfoSet = user.grade && user.class;
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;
  const [tutorial, setTutorial] = useRecoilState(tutorialAtom);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (isInfoSet && (isPWA || tutorial.ATHS)) return <></>;

  return (
    <Card w={{ base: '100%' }} border="1px solid" borderColor="border">
      <Center w="100%">
        <VStack w="100%">
          {!isInfoSet && (
            <>
              <Icon as={TbInfoCircle} w={16} h={16} color="blue.500" />
              <Text textStyle="title" align="center">
                学年・クラス等の情報を
                <Text as={RouterLink} to="/settings/account" textStyle="link">
                  設定
                </Text>
                してください。
              </Text>
            </>
          )}
          {!isPWA && !tutorial.ATHS && (
            <VStack w="100%" position="relative">
              <IconButton
                variant="ghost"
                aria-label="Close AddToHomeScreen info"
                position="absolute"
                top={0}
                right={0}
                icon={<TbX />}
                onClick={() =>
                  setTutorial((oldTutorial) => ({ ...oldTutorial, ATHS: true }))
                }
              />
              <Icon as={TbBulb} w={16} h={16} color="yellow.500" />
              <Text textStyle="title" textAlign="center">
                <Text as="span" textStyle="link" onClick={onATHSOpen}>
                  「ホーム画面に追加」
                </Text>
                すると、
                <br />
                より便利に使えるようになります
              </Text>
            </VStack>
          )}
        </VStack>
      </Center>
    </Card>
  );
}

export default Info;
