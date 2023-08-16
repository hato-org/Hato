import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import CardElement from '@/components/cards';

const { persistAtom } = recoilPersist();

export const cards: DashboardCard[] = [
  {
    id: 'clock',
    name: '時計・日課',
    description: '現在日時、現在時刻、今日の日課を表示します。',
    component: <CardElement.Clock />,
  },
  {
    id: 'timetable',
    name: '時間割',
    description: '設定したマイ時間割の今日の日課を表示します。',
    component: <CardElement.Timetable />,
  },
  // {
  //   id: 'transit',
  //   name: '交通情報',
  //   description:
  //     '周辺路線の運転状況・屋代高校前駅から発車する\n直近3本の列車を表示します。',
  //   component: <CardElement.Transit />,
  // },
  {
    id: 'events',
    name: '今日の予定',
    description:
      '「年間行事予定」ページに登録されている今日の予定を表示します。',
    component: <CardElement.Events />,
  },
  {
    id: 'hatoboard',
    name: 'はとボード',
    description: 'ピン留めしたはとボードの投稿を表示します。',
    component: <CardElement.Hatoboard />,
  },
  {
    id: 'scienceroom',
    name: '理科室割',
    description: '今日の理科室割を表示します。',
    component: <CardElement.Scienceroom />,
  },
  {
    id: 'classmatch',
    name: 'クラスマッチ',
    description: 'クラスマッチに関する情報を表示します。',
    component: <CardElement.Classmatch />,
  },
  // {
  //   id: 'transit',
  //   name: '交通情報',
  //   component: CardElement.Transit /,
  // },
];

export const dashboardEditModeAtom = atom({
  key: 'hato.dashboard.editmode',
  default: false,
});

// eslint-disable-next-line import/prefer-default-export
export const cardOrderAtom = atom<string[]>({
  key: 'hato.card.order',
  default: ['timetable', 'events', 'hatoboard'],
  effects: [persistAtom],
});
