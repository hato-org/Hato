import { useState, useCallback } from 'react';
import {
  Button,
  Heading,
  HStack,
  Icon,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TbChevronDown, TbChevronRight } from 'react-icons/tb';
import { useSetRecoilState } from 'recoil';
import { Link as RouterLink } from 'react-router-dom';
import Loading from '../common/Loading';
import Card from '../posts/Card';
import Error from './Error';
import { usePinnedPosts } from '@/hooks/posts';
import { useHatoboard } from '@/services/posts';
import { tutorialModalAtom } from '@/store/tutorial';

function Hatoboard() {
  const setTutorialModal = useSetRecoilState(tutorialModalAtom);
  const onPinOpen = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, pin: true })),
    [setTutorialModal],
  );
  const { data, status, error } = useHatoboard();
  const pinnedPosts = usePinnedPosts(data);
  const [isLimited, setIsLimited] = useState(true);

  return (
    <VStack w="100%" spacing={4}>
      <HStack w="100%" pt={2} pl={2} as={RouterLink} to="/posts/hatoboard">
        <Heading as="h2" size="md">
          はとボード
        </Heading>
        <Spacer />
        <Icon as={TbChevronRight} w={5} h={5} />
      </HStack>
      {status === 'pending' ? (
        <Loading />
      ) : status === 'error' ? (
        <Error error={error} />
      ) : (
        <VStack w="100%" align="flex-start" spacing={4}>
          {pinnedPosts?.length ? (
            <VStack w="100%">
              {pinnedPosts.slice(0, isLimited ? 2 : undefined).map((post) => (
                <Card key={post._id} {...post} bg="panel" />
              ))}
              {pinnedPosts.length > 2 && (
                <Button
                  w="100%"
                  rounded="lg"
                  size="sm"
                  variant="ghost"
                  color="description"
                  leftIcon={
                    <Icon
                      as={TbChevronDown}
                      transform={`rotate(${isLimited ? '0deg' : '180deg'})`}
                      transition="all .2s ease"
                    />
                  }
                  onClick={() => setIsLimited((oldVal) => !oldVal)}
                >
                  {isLimited ? ' さらに表示' : '一部を表示'}
                </Button>
              )}
            </VStack>
          ) : (
            <VStack w="100%" pt={4}>
              <Text textStyle="description" fontWeight="bold">
                ピン留めされた投稿がありません
              </Text>
              <Text textStyle="link" fontWeight="bold" onClick={onPinOpen}>
                ピン留め方法
              </Text>
            </VStack>
          )}
        </VStack>
      )}
    </VStack>
  );
}

export default Hatoboard;
