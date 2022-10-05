import { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Text,
  Textarea,
  VStack,
  Button,
  useToast,
  ModalProps,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useMutation } from '@tanstack/react-query';
import { useClient } from '../../modules/client';
import { useUser } from '../../hooks/user';

interface ReportModalProps extends Omit<ModalProps, 'children'> {
  event?: Event;
}

function ReportModal({ isOpen, onClose, event }: ReportModalProps) {
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });
  const { data: user } = useUser();
  const { client } = useClient();

  const [reportType, setReportType] = useState('');
  const [reportComment, setReportComment] = useState('');

  const reportOptions = useMemo(
    () => [
      {
        label: '不正確な情報が含まれている',
        value: 'inaccurate information',
      },
      {
        label: '不適切なコンテンツである',
        value: 'Inappropriate content',
      },
    ],
    []
  );

  const { mutate: reportSubmit, isLoading: reportLoading } = useMutation(
    () =>
      client.post('/report', {
        content: null,
        embeds: [
          {
            title: 'Report',
            url: `https://hato.cf/calendar/events/${event?._id}`,
            color: 5814783,
            fields: [
              {
                name: 'Report reason',
                value: reportType,
              },
              {
                name: 'Comment',
                value: reportComment || 'none',
              },
            ],
            author: {
              name: user?.name,
              icon_url: user?.avatar,
            },
            footer: {
              text: user?.email,
              icon_url: user?.avatar,
            },
            timestamp: new Date().toISOString(),
          },
        ],
        attachments: [],
      }),
    {
      onSuccess: () => {
        onClose();
        toast({
          title: '報告しました。',
          status: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'エラーが発生しました。',
          status: 'error',
        });
      },
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="xl">
        <ModalHeader>報告</ModalHeader>
        <ModalBody>
          <VStack align="flex-start">
            <Text textStyle="title">タイプを選択</Text>
            <Select
              options={reportOptions}
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  w: '100%',
                }),
              }}
              onChange={(value) => setReportType(value?.label ?? '')}
            />
            <Text textStyle="title">コメント（任意）</Text>
            <Textarea
              rounded="lg"
              onChange={(e) => setReportComment(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button variant="ghost" rounded="lg" onClick={onClose}>
              キャンセル
            </Button>
            <Button
              colorScheme="blue"
              rounded="lg"
              onClick={() => reportSubmit()}
              isLoading={reportLoading}
              isDisabled={!reportType}
            >
              送信
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ReportModal;
