import { useCallback } from 'react';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '@/components/ui/dialog';
import {
  Heading,
  Text,
  VStack,
  List,
  Badge,
  Separator,
  Button,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { tutorialModalAtom } from '@/store/tutorial';

export default function Events() {
  const [tutorialModal, setTutorialModal] = useAtom(tutorialModalAtom);
  const onClose = useCallback(
    () => setTutorialModal((currVal) => ({ ...currVal, events: false })),
    [setTutorialModal],
  );

  return (
    <DialogRoot
      open={tutorialModal.events}
      onOpenChange={(e) => !e.open && onClose()}
      scrollBehavior="inside"
    >
      <DialogContent rounded="xl" bg="panel">
        <DialogHeader>使い方</DialogHeader>
        <DialogCloseTrigger top={4} right={4} />
        <DialogBody>
          <VStack align="flex-start">
            {/* <Heading size='lg'>年間行事予定</Heading> */}
            <List.Root textStyle="title">
              <List.Item>生徒による生徒のための年間行事予定表です</List.Item>
              <List.Item>どんな規模のイベントでもOKです</List.Item>
              <List.Item>
                誰でもイベントの追加・編集ができます
                <Text textStyle="description">
                  イベントを追加するとポイントがたまります
                </Text>
              </List.Item>
              <List.Item>
                あなたの貢献が全校の生徒の役に立ちます
                <Text textStyle="description">
                  積極的に貢献してくださると嬉しいです
                </Text>
              </List.Item>
              <List.Item>
                <Text color="red.500">
                  予定を追加すると利用者全員に公開されます
                </Text>
                <Text textStyle="description">
                  個人的な予定を追加しないようご注意ください
                </Text>
              </List.Item>
            </List.Root>
            <Separator />
            <Heading size="md">イベントの追加方法</Heading>
            <List.Root as="ol" pl={4} textStyle="title" gap={4}>
              <List.Item>右下の「イベントを追加」をタップ</List.Item>
              <List.Item>
                各項目を入力
                <List.Root gap={1}>
                  <List.Item>
                    タイトル
                    <Badge ml={1} colorScheme="red">
                      必須
                    </Badge>
                    <Text textStyle="description">イベントのタイトル。</Text>
                  </List.Item>
                  <List.Item>
                    説明
                    <Text textStyle="description">イベントの詳細な説明。</Text>
                  </List.Item>
                  <List.Item>
                    開始日時・終了日時
                    <Badge ml={1} colorScheme="red">
                      必須
                    </Badge>
                    <Text textStyle="description">
                      イベントが始まる時間・終了する時間。
                      <br />
                      「終日」をオンにすると、日単位になります。
                    </Text>
                  </List.Item>
                  <List.Item>
                    場所
                    <Text textStyle="description">
                      イベントが行われる場所。
                    </Text>
                  </List.Item>
                  <List.Item>
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
                  </List.Item>
                </List.Root>
              </List.Item>
              <List.Item>「追加する」をタップ</List.Item>
              <List.Item>完了！</List.Item>
            </List.Root>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <Button w="100%" colorScheme="blue" rounded="lg" onClick={onClose}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
