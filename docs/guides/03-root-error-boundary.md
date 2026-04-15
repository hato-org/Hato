# 03: ルートレベル ErrorBoundary の追加

## 現状の問題

- `src/App.tsx` に ErrorBoundary があるが、これは `RouterProvider` 以下のエラーのみ捕捉する
- `src/main.tsx` の Provider スタック（ChakraProvider, GoogleOAuthProvider, PersistQueryClientProvider）が初期化に失敗した場合、エラーを捕捉できず白画面になる
- `ErrorFallback` 自体がエラーを投げた場合もリカバリ不能

## 目標

- Provider 初期化失敗時でも最低限のエラー UI を表示する
- Chakra UI に依存しない最小限のフォールバック UI を用意する

## 実装手順

### Step 1: 最小限のルートエラーフォールバックを作成する

Chakra UI が利用できない状況を想定し、インラインスタイルのみで構築する。

`src/components/common/RootErrorFallback.tsx` を新規作成する。

```tsx
interface RootErrorFallbackProps {
  error: Error;
}

export default function RootErrorFallback({ error }: RootErrorFallbackProps) {
  const handleReload = () => {
    window.location.replace('/');
  };

  const handleClearAndReload = () => {
    // 全キャッシュを削除
    window.localStorage.clear();
    window.indexedDB?.databases().then((dbs) =>
      dbs.forEach((db) => {
        if (db.name) window.indexedDB.deleteDatabase(db.name);
      })
    );
    window.location.replace('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        padding: '2rem',
        fontFamily: '-apple-system, Inter, "Noto Sans JP Variable", sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          アプリケーションの初期化に失敗しました
        </h1>
        <p style={{ color: '#666', marginBottom: '0.5rem' }}>
          {error.message}
        </p>
        {import.meta.env.DEV && (
          <pre
            style={{
              textAlign: 'left',
              fontSize: '0.75rem',
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              maxHeight: '200px',
              marginBottom: '1rem',
            }}
          >
            {error.stack}
          </pre>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button
            onClick={handleReload}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              background: '#3182ce',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            再読み込み
          </button>
          <button
            onClick={handleClearAndReload}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '8px',
              background: '#e2e8f0',
              color: '#333',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            キャッシュ削除して再読み込み
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Step 2: main.tsx に ErrorBoundary を追加する

`src/main.tsx` を修正する。

**変更前:**
```tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <HelmetProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <PersistQueryClientProvider ...>
            <ColorModeScript />
            <App />
            ...
          </PersistQueryClientProvider>
        </GoogleOAuthProvider>
      </HelmetProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
```

**変更後:**
```tsx
import { ErrorBoundary } from 'react-error-boundary';
import RootErrorFallback from './components/common/RootErrorFallback';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <ChakraProvider theme={theme}>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <PersistQueryClientProvider ...>
              <ColorModeScript />
              <App />
              ...
            </PersistQueryClientProvider>
          </GoogleOAuthProvider>
        </HelmetProvider>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
```

### Step 3: index.html にも最終フォールバックを追加する（オプション）

React 自体の読み込みが失敗した場合に備え、`index.html` に `<noscript>` とスクリプトエラーハンドラを追加する。

```html
<div id="root"></div>
<noscript>
  <div style="text-align:center;padding:2rem;">
    <h1>JavaScript を有効にしてください</h1>
    <p>このアプリケーションの実行には JavaScript が必要です。</p>
  </div>
</noscript>
<script>
  window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'SCRIPT') {
      document.getElementById('root').innerHTML =
        '<div style="text-align:center;padding:2rem;">' +
        '<h1>読み込みエラー</h1>' +
        '<p>アプリケーションの読み込みに失敗しました。ページを再読み込みしてください。</p>' +
        '<button onclick="location.reload()">再読み込み</button>' +
        '</div>';
    }
  }, true);
</script>
```

## 確認事項

- [ ] ChakraProvider にダミーエラーを仕込んでフォールバック UI が表示されるか確認
- [ ] 「再読み込み」ボタンでアプリが正常に復帰するか確認
- [ ] 「キャッシュ削除して再読み込み」でクリーンな状態から再起動するか確認
- [ ] 本番ビルドでスタックトレースが非表示になるか確認

## 関連ファイル

- `src/main.tsx` — Provider スタック（主な変更対象）
- `src/App.tsx` — 既存の ErrorBoundary
- `src/components/common/ErrorFallback.tsx` — 既存のフォールバック UI
- `index.html` — HTML エントリポイント
