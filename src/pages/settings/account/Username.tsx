import { useState } from 'react';
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Button, HStack, Icon, Input, Text, VStack, useDisclosure, useToast } from '@chakra-ui/react';
import { TbEdit } from 'react-icons/tb';
import { useUserMutation } from '@/services/user';

export default function AccountUsername({ username }: { username: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <HStack id="modify-username" rounded="md" py={2} onClick={onOpen}>
        <Text textStyle="title" lineClamp={1}>
          {username}
        </Text>
        <Icon as={TbEdit} />
      </HStack>
      <UsernameModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

function UsernameModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toast = useToast({
    position: 'top-right',
    duration: 1500,
  });
  const { mutate, isPending } = useUserMutation();
  const [username, setUsername] = useState('');

  const isFulfilled = username.length <= 20;

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && (onClose)()} placement="center">
      <DialogContent bg="panel" rounded="xl">
        <DialogHeader>アカウント名の変更</DialogHeader>
        <DialogBody>
          <VStack>
            <Input
              rounded="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isInvalid={!isFulfilled}
              placeholder="新しいアカウント名（20文字以内）"
            />
            {!isFulfilled && (
              <Text fontWeight="bold" color="red.500" fontSize="sm">
                ユーザー名は20文字以内にしてください。
              </Text>
            )}
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} mr={2} rounded="lg">
            キャンセル
          </Button>
          <Button
            colorScheme="blue"
            onClick={
              isFulfilled
                ? () => {
                    mutate(
                      { name: username },
                      {
                        onSuccess: () => {
                          toast({
                            title: '変更しました。',
                            status: 'success',
                          });
                          onClose();
                        },
                        onError: () => {
                          toast({
                            title: 'エラーが発生しました',
                            status: 'error',
                          });
                        },
                      },
                    );
                  }
                : undefined
            }
            rounded="lg"
            disabled={!isFulfilled}
            loading={isPending}
          >
            変更する
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
