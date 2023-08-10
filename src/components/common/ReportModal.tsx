import React, { useState, useMemo } from 'react';
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
  ModalProps,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useReport } from '@/hooks/report';

interface ReportModalProps extends Omit<ModalProps, 'children'> {
  placeholder?: string;
  url: string;
}

const ReportModal = React.memo(
  ({ isOpen, onClose, url, placeholder }: ReportModalProps) => {
    const [reportType, setReportType] = useState<ReportType>();
    const [reportComment, setReportComment] = useState('');

    const reportOptions = useMemo(
      () => [
        {
          label: '荒らし行為',
          value: 'spam',
        },
        {
          label: '不正確な情報が含まれている',
          value: 'inaccurate',
        },
        {
          label: 'その他',
          value: 'other',
        },
      ],
      []
    );

    const { mutate, isLoading: reportLoading } = useReport();

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl" bg="panel">
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
                  menu: (provided) => ({
                    ...provided,
                    shadow: 'lg',
                  }),
                }}
                onChange={(value) =>
                  setReportType((value?.value as ReportType) ?? '')
                }
              />
              <Text textStyle="title">コメント</Text>
              <Textarea
                placeholder={placeholder}
                rounded="lg"
                onChange={(e) => setReportComment(e.target.value)}
                isInvalid={reportType === 'other' && !reportComment}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack w="full">
              <Button w="full" variant="ghost" rounded="lg" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                w="full"
                colorScheme="blue"
                rounded="lg"
                onClick={() =>
                  mutate({
                    type: reportType!,
                    title: '報告',
                    description: reportComment,
                    url,
                  })
                }
                isLoading={reportLoading}
                isDisabled={
                  !reportType || (reportType === 'other' && !reportComment)
                }
              >
                送信
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default ReportModal;
