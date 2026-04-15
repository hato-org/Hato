# 11: ErrorFallback の改善

## 現状の問題

- `src/components/common/ErrorFallback.tsx` で `error.stack` が本番環境でもそのまま表示される（L49-51）
- エラーレポート送信 (`mutate`) は `useReport()` 経由だが、QueryClient が破損している場合は送信失敗する
- `useAuth()` を呼び出しているが、Router コンテキスト外で使用された場合にクラッシュする
- `useRouteError()` は React Router のルートエラーのみ対応し、App.tsx の ErrorBoundary からは `error` prop で渡される

## 目標

- 本番環境でスタックトレースを非表示にする
- エラーレポート送信を堅牢にする
- Router コンテキスト外でも動作するようにする

## 実装手順

### Step 1: ErrorFallback を二段構成にする

ルートエラー用（React Router `errorElement`）と ErrorBoundary 用で共通のUI を使えるよう分離する。

`src/components/common/ErrorFallback.tsx` を修正する。

```tsx
import { useMemo, useState } from 'react';
import {
  Button,
  Center,
  Checkbox,
  Code,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { TbLoader, TbRotate } from 'react-icons/tb';
import { useRouteError } from 'react-router';

/**
 * React Router の errorElement として使用するラッパー。
 * useRouteError() からエラーを取得し、ErrorUI に渡す。
 */
export default function ErrorFallback() {
  const error = useRouteError() as Error;
  return <ErrorUI error={error} />;
}

interface ErrorUIProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

/**
 * エラー表示 UI の実体。
 * ErrorBoundary の FallbackComponent としても、
 * React Router の errorElement 内からも使用可能。
 */
export function ErrorUI({ error, resetErrorBoundary }: ErrorUIProps) {
  const [sendReport, setSendReport] = useState(true);

  // eslint-disable-next-line no-console
  console.error(error);

  const report = useMemo<ReportSchema>(
    () => ({
      type: 'error',
      title: error.name,
      description: error.stack ?? error.message,
      url: window.location.toString(),
    }),
    [error],
  );

  const handleSendReport = () => {
    if (!import.meta.env.DEV && sendReport) {
      // QueryClient に依存しない直接送信
      try {
        navigator.sendBeacon(
          '/api/report',
          new Blob([JSON.stringify(report)], { type: 'application/json' })
        );
      } catch {
        // レポート送信失敗は無視（本体のエラーリカバリを優先）
      }
    }
  };

  return (
    <Center w="full" h={[['100vh', '100dvh']]} p={8}>
      <VStack w="full" spacing={4} userSelect="text">
        <Heading>エラーが発生しました</Heading>
        <Code rounded="md">{error.message}</Code>
        {import.meta.env.DEV && (
          <Code
            maxW="full"
            p={2}
            overflowX="auto"
            rounded="lg"
            fontSize="xs"
            whiteSpace="pre"
          >
            {error.stack}
          </Code>
        )}
        <Button
          leftIcon={<TbRotate />}
          colorScheme="blue"
          rounded="xl"
          onClick={() => {
            handleSendReport();
            if (resetErrorBoundary) {
              resetErrorBoundary();
            } else {
              window.location.assign('/');
            }
          }}
        >
          再読み込み
        </Button>
        <Button
          leftIcon={<TbLoader />}
          rounded="xl"
          onClick={async () => {
            handleSendReport();
            const dbs = await window.indexedDB?.databases();
            dbs?.forEach((db) => {
              if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
            window.localStorage.clear();
            window.location.replace('/');
          }}
        >
          ログアウト・キャッシュ削除
        </Button>
        <Checkbox
          isChecked={sendReport}
          onChange={(e) => setSendReport(e.target.checked)}
          textStyle="title"
        >
          エラーレポートを送信する
        </Checkbox>
      </VStack>
    </Center>
  );
}
```

### Step 2: App.tsx の ErrorBoundary で ErrorUI を使用する

```tsx
import { ErrorUI } from './components/common/ErrorFallback';

<ErrorBoundary
  FallbackComponent={({ error, resetErrorBoundary }) => (
    <ErrorUI error={error} resetErrorBoundary={resetErrorBoundary} />
  )}
  onReset={() => {
    window.location.reload();
  }}
>
```

### Step 3: エラーレポート送信の変更

- `useReport()` フック（TanStack Query mutation）の代わりに `navigator.sendBeacon()` を使用する
- `sendBeacon` はページ遷移/アンロード中でも確実に送信される
- QueryClient が破損していても動作する
- API エンドポイントが `sendBeacon` に対応しているか確認が必要

## 確認事項

- [ ] 本番ビルドでスタックトレースが非表示になるか確認
- [ ] 開発モードではスタックトレースが表示されるか確認
- [ ] 「再読み込み」ボタンが正常に動作するか確認
- [ ] 「ログアウト・キャッシュ削除」ボタンが正常に動作するか確認
- [ ] エラーレポートが `sendBeacon` で送信されるか確認
- [ ] バックエンド API が `sendBeacon` のリクエスト形式を受け付けるか確認

## 関連ファイル

- `src/components/common/ErrorFallback.tsx` — 主な変更対象
- `src/App.tsx` — ErrorBoundary の FallbackComponent 指定
- `src/services/report/index.ts` — 既存のレポートサービス（参考）
