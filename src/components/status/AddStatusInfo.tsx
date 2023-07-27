import React, { useState } from 'react';
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
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { TbChevronRight } from 'react-icons/tb';
import { Select } from 'chakra-react-select';
import { format } from 'date-fns/esm';
import {
  useHatoStatusMaintenanceMutation,
  useHatoStatusServerList,
} from '@/hooks/status';

const AddStatusInfo = React.memo(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { data } = useHatoStatusServerList();
    const { mutate, isLoading } = useHatoStatusMaintenanceMutation();
    const [statusInfo, setStatusInfo] = useState<StatusMaintenance>({
      type: 'maintenance',
      title: '',
      description: '',
      startAt: '',
      endAt: '',
      scope: [],
    });

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="panel" rounded="xl">
          <ModalHeader>メンテナンス情報の追加</ModalHeader>
          <ModalBody>
            <VStack spacing={8}>
              <Input
                rounded="lg"
                placeholder="タイトル"
                value={statusInfo.title}
                onChange={(e) =>
                  setStatusInfo((curr) => ({ ...curr, title: e.target.value }))
                }
                isInvalid={!statusInfo.title}
              />
              <Textarea
                rounded="lg"
                placeholder="説明"
                value={statusInfo.description}
                onChange={(e) =>
                  setStatusInfo((curr) => ({
                    ...curr,
                    description: e.target.value,
                  }))
                }
                isInvalid={!statusInfo.description}
              />
              <HStack w="full" spacing={4}>
                <Input
                  type="datetime-local"
                  value={
                    statusInfo.startAt
                      ? format(new Date(statusInfo.startAt), 'yyyy-MM-dd HH:mm')
                      : undefined
                  }
                  onChange={(e) =>
                    setStatusInfo((curr) => ({
                      ...curr,
                      startAt: new Date(e.target.value).toISOString() ?? '',
                    }))
                  }
                  isInvalid={!statusInfo.startAt}
                />
                <Icon as={TbChevronRight} boxSize={6} />
                <Input
                  type="datetime-local"
                  value={
                    statusInfo.endAt
                      ? format(new Date(statusInfo.endAt), 'yyyy-MM-dd HH:mm')
                      : undefined
                  }
                  onChange={(e) =>
                    setStatusInfo((curr) => ({
                      ...curr,
                      endAt: new Date(e.target.value).toISOString() ?? '',
                    }))
                  }
                  isInvalid={!statusInfo.endAt}
                />
              </HStack>
              <Select
                isMulti
                isInvalid={!statusInfo.scope.length}
                placeholder="影響範囲"
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    w: 'full',
                    textStyle: 'title',
                  }),
                }}
                options={data?.map(({ id, name }) => ({
                  value: id,
                  label: name,
                }))}
                value={statusInfo.scope.map((serverId) => ({
                  value: serverId,
                  label: data?.find(({ id }) => id === serverId)?.name,
                }))}
                onChange={(e) =>
                  setStatusInfo((curr) => ({
                    ...curr,
                    scope: e.map(({ value }) => value),
                  }))
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              rounded="lg"
              colorScheme="blue"
              onClick={() => mutate(statusInfo, { onSuccess: onClose })}
              isLoading={isLoading}
              isDisabled={
                !statusInfo.title ||
                !statusInfo.description ||
                !statusInfo.startAt ||
                !statusInfo.endAt ||
                !statusInfo.scope.length
              }
            >
              追加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default AddStatusInfo;
