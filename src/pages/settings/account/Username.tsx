import { useState } from 'react';
import {
  Button,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { TbEdit } from 'react-icons/tb';
import { useUserMutation } from '@/services/user';

export default function AccountUsername({ username }: { username: string }) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <HStack id="modify-username" rounded="md" py={2} onClick={onOpen}>
        <Text textStyle="title" noOfLines={1}>
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="panel" rounded="xl">
        <ModalHeader>アカウント名の変更</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
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
            isDisabled={!isFulfilled}
            isLoading={isPending}
          >
            変更する
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
