import { useCallback } from 'react';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot } from '@/components/ui/dialog';
import { Heading, Text, VStack, ListItem, UnorderedList, OrderedList, Badge, Separator, Button } from '@chakra-ui/react';
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
      onOpenChange={(e) => !e.open && (onClose)()}
      scrollBehavior="inside"
    >
      <DialogContent rounded="xl" bg="panel">
        <DialogHeader>使い方</DialogHeader>
        <DialogCloseTrigger top={4} right={4} />
        <DialogBody>
          <VStack align="flex-start">
            {/* <Heading size='lg'>年間行事予定</Heading> */}
            <UnorderedList textStyle="title">
              <ListItem>生徒による生徒のための年間行事予定表です</ListItem>
              <ListItem>どんな規模のイベントでもOKです</ListItem>
              <ListItem>
                誰でもイベントの追加・編集ができます
                <Text textStyle="description">
                  イベントを追加するとポイントがたまります
                </Text>
              </ListItem>
              <ListItem>
                あなたの貢献が全校の生徒の役に立ちます
                <Text textStyle="description">
                  積極的に貢献してくださると嬉しいです
                </Text>
              </ListItem>
              <ListItem>
                <Text color="red.500">
                  予定を追加すると利用者全員に公開されます
                </Text>
                <Text textStyle="description">
                  個人的な予定を追加しないようご注意ください
                </Text>
              </ListItem>
            </UnorderedList>
            <Separator />
            <Heading size="md">イベントの追加方法</Heading>
            <OrderedList pl={4} textStyle="title" gap={4}>
              <ListItem>右下の「イベントを追加」をタップ</ListItem>
              <ListItem>
                各項目を入力
                <UnorderedList gap={1}>
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
