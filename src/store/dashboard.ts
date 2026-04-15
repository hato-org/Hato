import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const cards: DashboardCard[] = [
  {
    id: 'clock',
    name: '時計・日課',
    description: '現在日時、現在時刻、今日の日課を表示します。',
  },
  {
    id: 'timetable',
    name: '時間割',
    description: '設定したマイ時間割の今日の日課を表示します。',
  },
  {
    id: 'transit',
    name: '交通情報',
    description:
      '周辺路線の運転状況・屋代高校前駅から発車する\n直近3本の列車を表示します。',
  },
  {
    id: 'events',
    name: '今日の予定',
    description:
      '「年間行事予定」ページに登録されている今日の予定を表示します。',
  },
  {
    id: 'hatoboard',
    name: 'はとボード',
    description: 'ピン留めしたはとボードの投稿を表示します。',
  },
  {
    id: 'scienceroom',
    name: '理科室割',
    description: '今日の理科室割を表示します。',
  },
  {
    id: 'classmatch',
    name: 'クラスマッチ',
    description: 'クラスマッチに関する情報を表示します。',
  },
];

export const dashboardEditModeAtom = atom(false);

export const cardOrderAtom = atomWithStorage<string[]>('hato.card.order', [
  'timetable',
  'events',
  'hatoboard',
]);
