# 12: dashboard.tsx からの JSX 分離

## 現状の問題

- `src/store/dashboard.tsx` はストアファイルだが、JSX（`<CardElement.Clock />` 等）を含んでいる
- これにより、ストアファイルがコンポーネントツリーの import に依存する
- ストアは本来データのみを管理すべきで、レンダリングロジックは含めるべきではない
- ファイル拡張子が `.tsx` になっている（ストアファイルは `.ts` であるべき）

## 目標

- ストアファイルからJSX を除去し、データ定義のみにする
- カードのコンポーネントマッピングをコンポーネント側に移動する

## 実装手順

### Step 1: DashboardCard 型を修正する

現在の `DashboardCard` 型（`src/@types/` に定義されていると思われる）を確認し、`component` フィールドの型を変更する。

```bash
grep -rn "DashboardCard" src/ --include="*.ts" --include="*.tsx" --include="*.d.ts"
```

**変更前:**
```typescript
interface DashboardCard {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode; // JSX を含む
}
```

**変更後:**
```typescript
interface DashboardCard {
  id: string;
  name: string;
  description: string;
}
```

### Step 2: dashboard.tsx をデータのみにリファクタリングする

`src/store/dashboard.tsx` → `src/store/dashboard.ts` にリネームする。

**変更前:**
```tsx
import CardElement from '@/components/cards';

export const cards: DashboardCard[] = [
  {
    id: 'clock',
    name: '時計・日課',
    description: '現在日時、現在時刻、今日の日課を表示します。',
    component: <CardElement.Clock />,
  },
  // ...
];
```

**変更後:**
```typescript
// JSX import を削除
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
    description: '周辺路線の運転状況・屋代高校前駅から発車する\n直近3本の列車を表示します。',
  },
  {
    id: 'events',
    name: '今日の予定',
    description: '「年間行事予定」ページに登録されている今日の予定を表示します。',
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
```

### Step 3: カードコンポーネントマッピングを作成する

`src/components/cards/cardMap.tsx` を新規作成する（または `src/components/cards/index.tsx` に追加する）。

```tsx
import { ReactNode } from 'react';
import CardElement from '@/components/cards';

export const cardComponentMap: Record<string, ReactNode> = {
  clock: <CardElement.Clock />,
  timetable: <CardElement.Timetable />,
  transit: <CardElement.Transit />,
  events: <CardElement.Events />,
  hatoboard: <CardElement.Hatoboard />,
  scienceroom: <CardElement.Scienceroom />,
  classmatch: <CardElement.Classmatch />,
};
```

### Step 4: Dashboard ページで cardComponentMap を使用する

カードのレンダリング部分を更新する。

```tsx
import { cardComponentMap } from '@/components/cards/cardMap';
import { cards } from '@/store/dashboard';

// レンダリング時
{cards.map(card => (
  <div key={card.id}>
    {cardComponentMap[card.id]}
  </div>
))}
```

### Step 5: ファイルリネーム

```bash
git mv src/store/dashboard.tsx src/store/dashboard.ts
```

import パスの更新は不要（TypeScript は拡張子なしで import するため）。

## 確認事項

- [ ] `yarn build` が成功するか確認
- [ ] ダッシュボードの全カードが正常に表示されるか確認
- [ ] カードの並べ替え（D&D）が正常に動作するか確認
- [ ] カードの追加・削除が正常に動作するか確認

## 関連ファイル

- `src/store/dashboard.tsx` → `src/store/dashboard.ts` — 主な変更対象
- `src/components/cards/index.tsx` — カードエクスポート
- `src/pages/Dashboard.tsx` — カードのレンダリング
- `src/@types/` — DashboardCard 型定義
