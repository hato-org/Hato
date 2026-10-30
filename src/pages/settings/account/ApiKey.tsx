import { HStack, Icon, Text, useClipboard } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { TbCheck, TbCopy } from 'react-icons/tb';
import { useUser } from '@/services/user';

export default function AccountApiKey() {
  const { data: user } = useUser();
  const { copy, copied } = useClipboard({ value: user.apiKey });
  const toast = (options: Parameters<typeof toaster.create>[0]) =>
    toaster.create({ duration: 1500, ...options });

  return (
    <HStack
      onClick={() => {
        copy();
        toast({
          title: 'コピーしました。',
          type: 'success',
        });
      }}
    >
      <Text
        fontFamily="monospace"
        wordBreak="break-all"
        lineClamp={1}
        textStyle="title"
      >
        {user.apiKey.slice(0, 4)}...
      </Text>
      <Icon
        transition="all .2s ease"
        color={copied ? 'green.400' : undefined}
        as={copied ? TbCheck : TbCopy}
      />
    </HStack>
  );
}
