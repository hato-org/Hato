# 06: デッドコードの削除

## 現状の問題

- `src/routes.tsx` にコメントアウトされたコードが複数ある
  - L12: Dashboard の lazy import（#05 で対応）
  - L133-142: Library の子ルート定義
- `src/modules/auth/index.ts` にコメントアウトされた旧ログインフロー（L41-72）がある
- `src/store/dashboard.tsx` にコメントアウトされた Transit カード定義（L50-54）がある
- `src/utils/recoil_migration.ts` がマイグレーション完了後も残っている可能性がある

## 目標

- コメントアウトされたデッドコードを全て削除する
- 必要に応じて git history への参照コメントを残す

## 実装手順

### Step 1: routes.tsx のデッドコード削除

**削除対象:**

1. L133-142 のコメントアウトされた Library 子ルート:
```typescript
// children: [
//   {
//     index: true,
//     element: <LibraryElement.Top />
//   },
//   {
//     path: 'search',
//     element: <LibraryElement.Search />
//   }
// ]
```

2. L12 の Dashboard lazy import コメント（#05 完了後に削除）

### Step 2: auth/index.ts のデッドコード削除

**削除対象:** L41-72 の旧 `GoogleCredentialResponse` ベースのログインフロー。

```typescript
// const login = useCallback(
//   async ({ credential }: GoogleCredentialResponse) => {
//     ... 30行以上のコメントアウト
//   },
//   [toast, setUser, navigate, onFail, queryClient]
// );
```

### Step 3: dashboard.tsx のデッドコード削除

**削除対象:** L50-54 のコメントアウトされた Transit カード。

```typescript
// {
//   id: 'transit',
//   name: '交通情報',
//   component: CardElement.Transit /,
// },
```

### Step 4: recoil_migration.ts の確認と削除

`src/utils/recoil_migration.ts` の内容を確認し、マイグレーションが完了している場合は削除する。

1. ファイル内容を確認: Recoil から Jotai へのストレージキーマイグレーションを行っている場合、十分な期間が経過しているか判断する
2. `main.tsx` (L18) の `import '@/utils/recoil_migration'` も同時に削除する

### Step 5: その他のデッドコードを検索する

```bash
# コメントアウトされたコードブロックを検索
grep -rn "^\s*//.*import\|^\s*//.*const\|^\s*//.*export" src/ --include="*.ts" --include="*.tsx"
```

## 確認事項

- [ ] `yarn build` が成功するか確認
- [ ] `yarn lint` がエラーなく通過するか確認
- [ ] 各ページの動作に影響がないか確認
- [ ] recoil_migration を削除する場合、既存ユーザーのデータ移行が完了しているか確認

## 関連ファイル

- `src/routes.tsx` — コメントアウトされたルート
- `src/modules/auth/index.ts` — 旧ログインフロー
- `src/store/dashboard.tsx` — コメントアウトされたカード
- `src/utils/recoil_migration.ts` — マイグレーションスクリプト
- `src/main.tsx` — recoil_migration のインポート
