import React, { useState } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import {
  Button,
  Field,
  HStack,
  Icon,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { TbChevronRight } from 'react-icons/tb';
import { Select } from 'chakra-react-select';
import { format } from 'date-fns';
import {
  useHatoStatusMaintenanceMutation,
  useHatoStatusServerList,
} from '@/services/status';

const AddStatusInfo = React.memo(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { data } = useHatoStatusServerList();
    const { mutate, isPending } = useHatoStatusMaintenanceMutation();
    const [statusInfo, setStatusInfo] = useState<StatusMaintenance>({
      type: 'maintenance',
      title: '',
      description: '',
      startAt: '',
      endAt: '',
      scope: [],
    });

    return (
      <DialogRoot
        open={isOpen}
        onOpenChange={(e) => !e.open && onClose()}
        size="xl"
      >
        <DialogContent bg="panel" rounded="xl">
          <DialogHeader>メンテナンス情報の追加</DialogHeader>
          <DialogBody>
            <VStack gap={8}>
              <Field.Root invalid={!statusInfo.title}>
                <Input
                  rounded="lg"
                  placeholder="タイトル"
                  value={statusInfo.title}
                  onChange={(e) =>
                    setStatusInfo((curr) => ({
                      ...curr,
                      title: e.target.value,
                    }))
                  }
                />
              </Field.Root>
              <Field.Root invalid={!statusInfo.description}>
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
                />
              </Field.Root>
              <HStack w="full" gap={4}>
                <Field.Root invalid={!statusInfo.startAt}>
                  <Input
                    type="datetime-local"
                    value={
                      statusInfo.startAt
                        ? format(
                            new Date(statusInfo.startAt),
                            'yyyy-MM-dd HH:mm',
                          )
                        : undefined
                    }
                    onChange={(e) =>
                      setStatusInfo((curr) => ({
                        ...curr,
                        startAt: new Date(e.target.value).toISOString() ?? '',
                      }))
                    }
                  />
                </Field.Root>
                <Icon as={TbChevronRight} boxSize={6} />
                <Field.Root invalid={!statusInfo.endAt}>
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
                  />
                </Field.Root>
              </HStack>
              <Select
                isMulti
                invalid={!statusInfo.scope.length}
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
          </DialogBody>
          <DialogFooter>
            <Button
              w="full"
              rounded="lg"
              colorScheme="blue"
              onClick={() => mutate(statusInfo, { onSuccess: onClose })}
              loading={isPending}
              disabled={
                !statusInfo.title ||
                !statusInfo.description ||
                !statusInfo.startAt ||
                !statusInfo.endAt ||
                !statusInfo.scope.length
              }
            >
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  },
);
AddStatusInfo.displayName = 'AddStatusInfo';

export default AddStatusInfo;
