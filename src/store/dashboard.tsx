import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import CardElement from '@/components/cards';

const { persistAtom } = recoilPersist();

export const cards: DashboardCard[] = [
  {
    id: 'timetable',
    name: '時間割 / 交通情報',
    description:
      '自分のコースの時間割を表示します。\n時間割未設定日・終業後は交通情報を表示します。',
    component: <CardElement.Timetable />,
  },
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
