import { useState } from 'react';
import {
  Field,
  HStack,
  Icon,
  IconButton,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { toaster } from '@/components/ui/toaster';
import { TbCheck, TbX } from 'react-icons/tb';
import { useAtomValue } from 'jotai';
import { useUserInfo } from '@/services/user';
import Loading from '../common/Loading';
import { useReport } from '@/services/report';
import { classmatchTournamentAtom } from '@/store/overlay';
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
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1500, ...options });
  const classmatchTournament = useAtomValue(classmatchTournamentAtom);
  const [description, setDescription] = useState('');
  const { data, status, error } = useUserInfo(history?.at(-1)?.userId ?? '', {
    enabled: !!history?.at(-1),
  });

  const { mutate, isPending: reportPending } = useReport({
    onSuccess: () => {
      toast({
        title: '送信しました。',
        type: 'success',
      });
    },
    onError: (e) => {
      toast({
        title: '送信に失敗しました。',
        description: e.message,
        type: 'error',
      });
    },
  });

  return (
    <VStack w="full" align="flex-start" gap={4}>
      <Text textStyle="description" fontWeight="bold" fontSize="xs">
        最後に編集したユーザー
      </Text>
      {history?.at(-1) ? (
        status === 'pending' ? (
          <Loading />
        ) : status === 'error' ? (
          <Error error={error} />
        ) : (
          <HStack gap={4} align="center">
            <Avatar src={data.avatar} size="sm" />
            <VStack align="flex-start" gap={0}>
              <Text textStyle="title" lineClamp={1}>
                {data.name}
              </Text>
              <Text textStyle="description" fontSize="xs" lineClamp={1}>
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
      <Field.Root invalid={!description}>
        <Textarea
          rounded="lg"
          placeholder="例：荒らし"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field.Root>
      <HStack w="full" gap={4}>
        <IconButton
          aria-label="cancel"
          colorScheme="red"
          variant="outline"
          rounded="lg"
          flex={1}
          onClick={onSubmit}
        >
          {<Icon as={TbX} />}
        </IconButton>
        <IconButton
          aria-label="confirm changes"
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
          loading={reportPending}
          disabled={!description}
        >
          {<Icon as={TbCheck} />}
        </IconButton>
      </HStack>
    </VStack>
  );
}
