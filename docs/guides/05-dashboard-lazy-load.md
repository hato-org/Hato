# 05: Dashboard の遅延読み込み化

## 現状の問題

- `src/routes.tsx` (L8) で `Dashboard` が直接 import されている
- L12 にコメントアウトされた `React.lazy()` 版がある（意図的に戻した可能性あり）
- 認証済みルートのため初期表示には不要だが、初期バンドルに含まれている

## 目標

- Dashboard を `React.lazy()` で遅延読み込みに変更し、初期バンドルサイズを削減する

## 実装手順

### Step 1: routes.tsx を修正する

**変更前:**
```typescript
import Dashboard from './pages/Dashboard';
// ...
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

**変更後:**
```typescript
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
```

- L8 の直接 import 行を削除する
- L12 のコメントアウトを解除する

### Step 2: ビルドサイズの確認

```bash
# 変更前のサイズを記録
yarn build 2>&1 | grep -E "dist/|\.js|\.css"

# 変更後のサイズを記録して比較
yarn build 2>&1 | grep -E "dist/|\.js|\.css"
```

## 備考

- Dashboard は認証済みルート（`RequireLogin` 内）であり、初回アクセスは必ずログイン後
- ログイン処理中に Dashboard チャンクがプリフェッチされるため、体感遅延は最小限
- もし意図的に eager load に戻した経緯がある場合は、git log で理由を確認すること

## 確認事項

- [ ] `yarn build` が成功するか確認
- [ ] Dashboard ページに正常に遷移できるか確認
- [ ] Dashboard チャンクが分離されたバンドルとして出力されるか確認

## 関連ファイル

- `src/routes.tsx` — ルート定義（変更対象）
- `src/pages/Dashboard.tsx` — Dashboard ページコンポーネント
