# 07: overlayAtom の分割

## 現状の問題

- `src/store/overlay.ts` の `overlayAtom` は6つの独立したUI状態を1つのオブジェクトアトムに格納している
- いずれか1つの値が変更されると、このアトムを購読する全コンポーネントが再レンダリングされる
- 例: メニューの開閉が、クラスマッチトーナメントモーダルの状態を購読するコンポーネントにも影響する

## 目標

- 各状態を独立したアトムに分割し、不要な再レンダリングを排除する
- 永続化が必要な状態と一時的な状態を明確に分離する

## 実装手順

### Step 1: 現状のアトム利用箇所を調査する

```bash
grep -rn "overlayAtom" src/ --include="*.ts" --include="*.tsx"
```

全ての利用箇所とアクセスしているプロパティを特定する。

### Step 2: 個別アトムに分割する

`src/store/overlay.ts` を修正する。

**変更前:**
```typescript
interface Overlay {
  menu: boolean;
  cardOrder: boolean;
  whatsNew: boolean;
  userScheduleEditor: string | false;
  userSubjectEditor: string | false;
  classmatchTournament:
    | { year: number; season: ClassmatchSeason; sport: ClassmatchSportId }
    | undefined;
}

export const overlayAtom = atomWithStorage<Overlay>('hato.overlay', {
  menu: false,
  cardOrder: false,
  whatsNew: false,
  userScheduleEditor: false,
  userSubjectEditor: false,
  classmatchTournament: undefined,
});
```

**変更後:**
```typescript
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 永続化が必要な状態（UI の表示/非表示のユーザー選択）
export const menuOpenAtom = atom(false);
export const cardOrderVisibleAtom = atom(false);
export const whatsNewVisibleAtom = atomWithStorage('hato.overlay.whatsNew', false);

// 一時的な状態（セッション中のみ有効）
export const userScheduleEditorAtom = atom<string | false>(false);
export const userSubjectEditorAtom = atom<string | false>(false);

interface ClassmatchTournamentOverlay {
  year: number;
  season: ClassmatchSeason;
  sport: ClassmatchSportId;
}
export const classmatchTournamentAtom = atom<ClassmatchTournamentOverlay | undefined>(undefined);
```

**設計判断:**
- `menu`, `cardOrder` は一時的な UI 状態であり、ページリロード後にリセットされるべきなので `atom()` を使用
- `whatsNew` は「既読」的な意味合いがあるなら `atomWithStorage` を維持
- `userScheduleEditor`, `userSubjectEditor` はエディタの開閉状態なので `atom()` で十分
- `classmatchTournament` はモーダル表示用の一時データなので `atom()` で十分

### Step 3: 利用箇所を一括置換する

各コンポーネントで `overlayAtom` を使っている箇所を個別アトムに置き換える。

**パターン A: `useAtom(overlayAtom)` でオブジェクト全体を取得しているケース**

```typescript
// 変更前
const [overlay, setOverlay] = useAtom(overlayAtom);
const isMenuOpen = overlay.menu;
const toggleMenu = () => setOverlay(prev => ({ ...prev, menu: !prev.menu }));

// 変更後
const [isMenuOpen, setMenuOpen] = useAtom(menuOpenAtom);
const toggleMenu = () => setMenuOpen(prev => !prev);
```

**パターン B: 特定プロパティのみ読み取っているケース**

```typescript
// 変更前
const overlay = useAtomValue(overlayAtom);
if (overlay.classmatchTournament) { ... }

// 変更後
const classmatchTournament = useAtomValue(classmatchTournamentAtom);
if (classmatchTournament) { ... }
```

### Step 4: 旧ストレージキーのクリーンアップ

既存ユーザーの localStorage に残る `hato.overlay` キーをクリーンアップする。

```typescript
// src/utils/storage_cleanup.ts （または既存の migration ファイルに追加）
const OLD_OVERLAY_KEY = 'hato.overlay';
if (localStorage.getItem(OLD_OVERLAY_KEY)) {
  localStorage.removeItem(OLD_OVERLAY_KEY);
}
```

### Step 5: overlay.ts の旧コードを削除する

分割完了後、旧 `Overlay` interface と `overlayAtom` を削除する。

## 確認事項

- [ ] 全ての overlayAtom 利用箇所が個別アトムに置換されているか確認
- [ ] メニュー開閉、カード順序編集、What's New 表示、時間割エディタ、クラスマッチモーダルが正常に動作するか確認
- [ ] `yarn build` が成功するか確認
- [ ] React DevTools で不要な再レンダリングが減少したか確認

## 関連ファイル

- `src/store/overlay.ts` — 主な変更対象
- `grep -rn "overlayAtom" src/` で特定される全ファイル
