# 13: 大規模コンポーネントの分割

## 現状の問題

- `src/pages/Dashboard.tsx` が約297行と大規模
- `src/pages/Timetable.tsx` が約251行と大規模
- 1つのファイルに複数の責務が混在しており、テスト・保守が困難

## 目標

- 各ページを150行以下のサブコンポーネントに分割する
- 責務ごとに明確に分離する

## 実装手順

### Step 1: Dashboard.tsx の分割

現在の Dashboard の責務を分析する。

```bash
wc -l src/pages/Dashboard.tsx
```

**想定される分割:**

```
src/pages/Dashboard.tsx (メイン: レイアウト + 状態管理)
├── src/components/dashboard/DashboardHeader.tsx    — ヘッダー（編集モードトグル）
├── src/components/dashboard/DashboardCardList.tsx  — カードリスト（D&D コンテナ）
├── src/components/dashboard/DashboardCard.tsx      — 個別カード（D&D アイテム）
├── src/components/dashboard/CardAddMenu.tsx        — カード追加メニュー
└── src/components/dashboard/EditModeToolbar.tsx    — 編集モードツールバー
```

**分割手順:**

1. Dashboard.tsx を読み、コンポーネント内のセクションを特定する
2. 各セクションを独立したコンポーネントファイルに抽出する
3. props または既存のアトム経由で状態を共有する
4. Dashboard.tsx はレイアウトと子コンポーネントの組み合わせのみにする

**分割後の Dashboard.tsx の想定形:**

```tsx
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardCardList from '@/components/dashboard/DashboardCardList';
import CardAddMenu from '@/components/dashboard/CardAddMenu';

export default function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <DashboardCardList />
      <CardAddMenu />
    </>
  );
}
```

### Step 2: Timetable.tsx の分割

**想定される分割:**

```
src/pages/Timetable.tsx (メイン: レイアウト + データ取得)
├── src/components/timetable/TimetableHeader.tsx    — ヘッダー（週切り替え）
├── src/components/timetable/TimetableGrid.tsx      — 時間割グリッド
├── src/components/timetable/PeriodCell.tsx          — 個別セル
└── src/components/timetable/TimetableActions.tsx    — アクションボタン
```

### Step 3: その他の大規模コンポーネントの確認

```bash
# 200行以上のコンポーネントファイルを検索
find src/ -name "*.tsx" -exec sh -c 'lines=$(wc -l < "$1"); if [ "$lines" -gt 200 ]; then echo "$lines $1"; fi' _ {} \; | sort -rn
```

200行を超えるファイルがあれば同様に分割を検討する。

### Step 4: 分割時の原則

1. **Props の最小化**: 共有状態はアトムまたはコンテキストで管理し、props drilling を避ける
2. **コロケーション**: 関連するコンポーネントは同じディレクトリに配置する（例: `src/components/dashboard/`）
3. **命名規則**: 親コンポーネント名をプレフィックスにする（例: `DashboardHeader`, `DashboardCard`）
4. **単一責務**: 各コンポーネントは1つの責務のみ持つ
5. **テスタビリティ**: 分割により個別テストが容易になるようにする

## 確認事項

- [ ] 分割後のコンポーネントが正しくレンダリングされるか確認
- [ ] D&D 操作が分割後も正常に動作するか確認
- [ ] `yarn build` が成功するか確認
- [ ] 各サブコンポーネントが150行以下であるか確認

## 関連ファイル

- `src/pages/Dashboard.tsx` — 分割対象
- `src/pages/Timetable.tsx` — 分割対象
- `src/components/dashboard/` — 分割先ディレクトリ
- `src/components/timetable/` — 分割先ディレクトリ
