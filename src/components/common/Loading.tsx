import React, { useState, useEffect } from 'react';
import { Fade, Spinner, SpinnerProps, Text, VStack } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { MotionCenter } from '../motion';

const tips = [
  'Classroomの読み込みは時間がかかる場合があります',
  'Hatoはオープンソースです。ぜひ貢献してください！',
  'Hatoは多くの方の協力で成り立っています\n皆さんの協力に感謝します',
  '時間割は有志の方が手動で設定しています\nあなたも協力してみませんか？',
  '年間行事予定は生徒の協力により反映されています\nぜひ協力をお願いします',
  // 'はとボードの新着投稿は5分以内に反映されます',
  '交通情報は5分ごとに更新しています',
  '時刻表では各駅停車時刻・行先と接続を確認できます',
  'Classroomの課題と資料はブックマークできます',
  '3棟前モニター用の理科室割表示サイトを作ったのですが却下されました\nhttps://srtable-viewer.vercel.app/',
];

const Loading = React.memo(
  ({
    withTips,
    initialTip,
    ...rest
  }: { withTips?: boolean; initialTip?: number } & SpinnerProps) => {
    const [tipsShowed, setTipsShowed] = useState(false);
    const [tip, setTip] = useState(
      tips[initialTip ?? Math.floor(Math.random() * tips.length)],
    );

    useEffect(() => {
      setTimeout(() => {
        setTipsShowed(true);
      }, 1500);
    }, []);

    return (
      <VStack
        w="full"
        spacing={4}
        flexGrow={1}
        p={4}
        onClick={() => setTip(tips[Math.floor(Math.random() * tips.length)])}
        _hover={{ cursor: 'pointer' }}
      >
        <Spinner color="blue.400" thickness="3px" {...rest} />
        {withTips && (
          <Fade in={tipsShowed}>
            <Text
              whiteSpace="pre-wrap"
              textAlign="center"
              textStyle="description"
            >
              {tip}
            </Text>
          </Fade>
        )}
      </VStack>
    );
  },
);

export const GlobalLoading = React.memo(() => (
  <AnimatePresence>
    <MotionCenter
      key="global-loading"
      w="100%"
      h="100%"
      position="fixed"
      top={0}
      left={0}
      flexGrow={1}
      // transition="all .2s ease"
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
    >
      <Spinner size="lg" color="blue.400" thickness="3px" />
    </MotionCenter>
  </AnimatePresence>
));

export default Loading;
