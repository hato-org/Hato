import {
  Heading,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  ListItem,
  UnorderedList,
  OrderedList,
  Badge,
  Divider,
} from '@chakra-ui/react';

interface TutorialEventsProps {
  isOpen: boolean;
  onClose: () => void;
}

function Events({ isOpen, onClose }: TutorialEventsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent rounded="xl">
        <ModalHeader>使い方</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
          <VStack align="flex-start">
            {/* <Heading size='lg'>年間行事予定</Heading> */}
            <UnorderedList textStyle="title">
              <ListItem>今後の行事等をカレンダーで確認できます</ListItem>
              <ListItem>
                誰でもイベントの追加・編集ができます
                <Text textStyle="description">
                  イベントを追加するとポイントがたまります
                </Text>
              </ListItem>
              <ListItem>
                皆さんの協力によって成り立っています
                <Text textStyle="description">
                  積極的に貢献してくださると嬉しいです
                </Text>
              </ListItem>
            </UnorderedList>
            <Divider />
            <Heading size="md">イベントの追加方法</Heading>
            <OrderedList pl={4} textStyle="title" spacing={4}>
              <ListItem>右下の「イベントを追加」をタップ</ListItem>
              <ListItem>
                各項目を入力
                <UnorderedList spacing={1}>
                  <ListItem>
                    タイトル
                    <Badge ml={1} colorScheme="red">
                      必須
                    </Badge>
                    <Text textStyle="description">イベントのタイトル。</Text>
                  </ListItem>
                  <ListItem>
                    説明
                    <Text textStyle="description">イベントの詳細な説明。</Text>
                  </ListItem>
                  <ListItem>
                    開始日時・終了日時
                    <Badge ml={1} colorScheme="red">
                      必須
                    </Badge>
                    <Text textStyle="description">
                      イベントが始まる時間・終了する時間。
                      <br />
                      「終日」をオンにすると、日単位になります。
                    </Text>
                  </ListItem>
                  <ListItem>
                    場所
                    <Text textStyle="description">
                      イベントが行われる場所。
                    </Text>
                  </ListItem>
                  <ListItem>
                    タグ
                    <Badge ml={1} colorScheme="red">
                      必須
                    </Badge>
                    <Text textStyle="description">
                      イベントに関連するキーワード・教科・学年等のタグ。最低1個指定してください。
                      <br />
                      <Text fontSize="xs" color="red.500">
                        タグを正確に設定しないと、正常に表示されません。
                      </Text>
                    </Text>
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>「追加する」をタップ</ListItem>
              <ListItem>完了！</ListItem>
            </OrderedList>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default Events;
