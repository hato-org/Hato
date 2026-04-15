# 04: テスト基盤の導入

## 現状の問題

- vitest はインストール済みだが、テストファイルが1つも存在しない
- `yarn test` は `--passWithNoTests` フラグにより成功するが、実質テストカバレッジは 0%
- エラーバウンダリ、認証フロー、データ取得等の重要ロジックが未検証

## 目標

- React Testing Library + vitest によるテスト環境を構築する
- 主要コンポーネント・フック・ユーティリティのテストを書く
- CI で自動実行される基盤を整える

## 実装手順

### Step 1: テスト用依存パッケージのインストール

```bash
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Step 2: vitest の設定を追加する

`vite.config.ts` に test 設定を追加する。

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  // ... 既存の設定

  return {
    // ... 既存の設定
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      css: true,
    },
  };
});
```

### Step 3: テストセットアップファイルを作成する

`src/test/setup.ts` を新規作成する。

```typescript
import '@testing-library/jest-dom';
```

### Step 4: テストユーティリティを作成する

Provider のラッパーなど、テスト共通のユーティリティを用意する。

`src/test/utils.tsx` を新規作成する。

```tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import theme from '@/theme';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();
  return (
    <JotaiProvider>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    </JotaiProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

export * from '@testing-library/react';
export { customRender as render };
```

### Step 5: ユーティリティ関数のテストを書く（入門として）

テストの最初の一歩として、純粋関数のテストから始める。

`src/utils/date.test.ts` を新規作成する（既存の date.ts の内容に応じて具体化する）。

```typescript
import { describe, it, expect } from 'vitest';
// import { formatDate, ... } from './date';

describe('date utils', () => {
  it.todo('should format date correctly');
  it.todo('should handle edge cases');
});
```

`src/modules/library/index.test.ts` を新規作成する。

```typescript
import { describe, it, expect } from 'vitest';
import { generateISBN13, convertToLocalId } from './index';

describe('generateISBN13', () => {
  it('should return ISBN-13 as-is if already 13 digits', () => {
    expect(generateISBN13('978-4-123456-78-9')).toBe('978-4-123456-78-9');
  });

  it('should convert ISBN-10 to ISBN-13', () => {
    const result = generateISBN13('4-123456-78-9');
    expect(result).toMatch(/^978/);
    expect(result.replaceAll('-', '')).toHaveLength(13);
  });
});

describe('convertToLocalId', () => {
  it('should extract local ID from Negima format', () => {
    expect(convertToLocalId('Negima_GK_2004103-12345')).toBe('12345');
  });

  it('should return original ID if format does not match', () => {
    expect(convertToLocalId('other-id')).toBe('other-id');
  });
});
```

### Step 6: コンポーネントテストのサンプル

`src/components/common/ErrorFallback.test.tsx` を新規作成する。

```tsx
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils';

// ErrorFallback は useRouteError を使うため、モックが必要
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useRouteError: () => new Error('テストエラー'),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/services/report', () => ({
  useReport: () => ({ mutate: vi.fn() }),
}));

vi.mock('@/modules/auth', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

describe('ErrorFallback', () => {
  it.todo('should display error message');
  it.todo('should show reload button');
  it.todo('should show logout button');
  it.todo('should send error report when checkbox is checked');
});
```

### Step 7: TypeScript 設定の確認

`tsconfig.json` にテストファイルが含まれるようにする。既に `"include": ["src"]` なので通常は不要だが、確認する。

### Step 8: package.json のテストコマンドを更新する

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 推奨テストカバレッジの優先順位

| 優先度 | 対象 | テストタイプ |
|--------|------|-------------|
| 高 | `src/utils/` 全ファイル | ユニットテスト |
| 高 | `src/modules/library/` | ユニットテスト |
| 高 | `ErrorFallback` | コンポーネントテスト |
| 中 | `RequireLogin` | コンポーネントテスト |
| 中 | `src/store/` アトム | ユニットテスト |
| 中 | `useAuth` フック | 統合テスト |
| 低 | ページコンポーネント | スナップショットテスト |

## 確認事項

- [ ] `yarn test` でテストが正常に実行されるか確認
- [ ] パスエイリアス `@/*` がテスト環境で解決されるか確認（vite-tsconfig-paths が vitest でも動作する）
- [ ] Chakra UI のテーマがテスト環境で正しくロードされるか確認
- [ ] `--passWithNoTests` フラグを削除してもテストが通るか確認

## 関連ファイル

- `vite.config.ts` — vitest 設定の追加先
- `package.json` — テストコマンドとdevDependencies
- `src/utils/` — テスト対象のユーティリティ
- `src/modules/library/index.ts` — テスト対象の ISBN 変換
