import React, { useState, useMemo } from 'react';
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import {
  Field,
  HStack,
  Text,
  Textarea,
  VStack,
  Button,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useReport } from '@/services/report';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
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
      [],
    );

    const { mutate, isPending: reportPending } = useReport();

    return (
      <DialogRoot
        open={isOpen}
        onOpenChange={(e) => !e.open && onClose()}
        placement="center"
      >
        <DialogContent rounded="xl" bg="panel">
          <DialogHeader>報告</DialogHeader>
          <DialogBody>
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
              <Field.Root invalid={reportType === 'other' && !reportComment}>
                <Textarea
                  placeholder={placeholder}
                  rounded="lg"
                  onChange={(e) => setReportComment(e.target.value)}
                />
              </Field.Root>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <HStack w="full">
              <Button w="full" variant="ghost" rounded="lg" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                w="full"
                colorPalette="blue"
                rounded="lg"
                onClick={() =>
                  mutate({
                    type: reportType!,
                    title: '報告',
                    description: reportComment,
                    url,
                  })
                }
                loading={reportPending}
                disabled={
                  !reportType || (reportType === 'other' && !reportComment)
                }
              >
                送信
              </Button>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  },
);
ReportModal.displayName = 'ReportModal';

export default ReportModal;
