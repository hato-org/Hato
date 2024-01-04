import { HStack, Icon, Text, useClipboard, useToast } from '@chakra-ui/react';
import { TbCheck, TbCopy } from 'react-icons/tb';
import { useUser } from '@/services/user';

export default function AccountApiKey() {
  const { data: user } = useUser();
  const { onCopy, hasCopied } = useClipboard(user.apiKey);
  const toast = useToast({
    position: 'top-right',
    duration: 1500,
  });

  return (
    <HStack
      onClick={() => {
        onCopy();
        toast({
          title: 'コピーしました。',
          status: 'success',
        });
      }}
    >
      <Text
        fontFamily="monospace"
        wordBreak="break-all"
        noOfLines={1}
        textStyle="title"
      >
        {user.apiKey.slice(0, 4)}...
      </Text>
      <Icon
        transition="all .2s ease"
        color={hasCopied ? 'green.400' : undefined}
        as={hasCopied ? TbCheck : TbCopy}
      />
    </HStack>
  );
}
