import { useState } from 'react';
import {
  Avatar,
  HStack,
  Icon,
  IconButton,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { TbCheck, TbX } from 'react-icons/tb';
import { useRecoilValue } from 'recoil';
import { useUserInfo } from '@/services/user';
import Loading from '../common/Loading';
import { useReport } from '@/services/report';
import { overlayAtom } from '@/store/overlay';
import Error from '../cards/Error';

export default function MetaReporter({
  id,
  history,
  onSubmit,
}: {
  id: string;
  history: ClassmatchTournament['editHistory'];
  onSubmit: () => void;
}) {
  const toast = useToast({
    position: 'top-right',
    duration: 1500,
  });
  const { classmatchTournament } = useRecoilValue(overlayAtom);
  const [description, setDescription] = useState('');
  const { data, status, error } = useUserInfo(history?.at(-1)?.userId!, {
    enabled: !!history?.at(-1),
  });

  const { mutate, isPending: reportPending } = useReport({
    onSuccess: () => {
      toast({
        title: '送信しました。',
        status: 'success',
      });
    },
    onError: (e) => {
      toast({
        title: '送信に失敗しました。',
        description: e.message,
        status: 'error',
      });
    },
  });

  return (
    <VStack w="full" align="flex-start" spacing={4}>
      <Text textStyle="description" fontWeight="bold" fontSize="xs">
        最後に編集したユーザー
      </Text>
      {history?.at(-1) ? (
        status === 'pending' ? (
          <Loading />
        ) : status === 'error' ? (
          <Error error={error} />
        ) : (
          <HStack spacing={4} align="center">
            <Avatar src={data.avatar} size="sm" />
            <VStack align="flex-start" spacing={0}>
              <Text textStyle="title" noOfLines={1}>
                {data.name}
              </Text>
              <Text textStyle="description" fontSize="xs" noOfLines={1}>
                {data.email}
              </Text>
            </VStack>
          </HStack>
        )
      ) : (
        <Text
          w="full"
          textAlign="center"
          textStyle="description"
          fontWeight="bold"
        >
          以前に編集したユーザーはいません
        </Text>
      )}
      <Text textStyle="description" fontWeight="bold" fontSize="xs">
        報告理由
      </Text>
      <Textarea
        rounded="lg"
        placeholder="例：荒らし"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        isInvalid={!description}
      />
      <HStack w="full" spacing={4}>
        <IconButton
          aria-label="cancel"
          icon={<Icon as={TbX} />}
          colorScheme="red"
          variant="outline"
          rounded="lg"
          flex={1}
          onClick={onSubmit}
        />
        <IconButton
          aria-label="confirm changes"
          icon={<Icon as={TbCheck} />}
          rounded="lg"
          colorScheme="green"
          flex={2}
          onClick={() =>
            mutate(
              {
                title: '報告（クラスマッチ）',
                description,
                fields: [
                  {
                    name: 'Sport',
                    value: classmatchTournament?.sport ?? '',
                  },
                  {
                    name: 'Match ID',
                    value: id,
                  },
                ],
                url: window.location.toString(),
              },
              {
                onSuccess: onSubmit,
              },
            )
          }
          isLoading={reportPending}
          isDisabled={!description}
        />
      </HStack>
    </VStack>
  );
}
