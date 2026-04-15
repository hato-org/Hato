# Hato 改善 TODO リスト

本ドキュメントはアプリケーション設計レビューの結果に基づき、改善すべき項目を優先度順にまとめたものです。
各項目の詳細な実装手順は、対応する手順書ファイルを参照してください。

---

## 🔴 Priority 1 — セキュリティ・安定性（最優先）

| # | タイトル | 手順書 | 概要 | 状態 |
|---|---------|--------|------|------|
| 1 | JWT トークンリフレッシュの実装 | [01-jwt-token-refresh.md](./guides/01-jwt-token-refresh.md) | トークン期限切れ時の自動リフレッシュ機構を導入し、無条件ログアウトを防止する | ✅ |
| 2 | 401 レスポンス処理の改善 | [02-401-handling.md](./guides/02-401-handling.md) | `window.location.replace()` によるハードリロードを React Router ベースのナビゲーションに置き換える | ✅ |
| 3 | ルートレベル ErrorBoundary の追加 | [03-root-error-boundary.md](./guides/03-root-error-boundary.md) | Provider 初期化失敗時のリカバリを可能にするため `main.tsx` にエラーバウンダリを追加する | ✅ |
| 4 | テスト基盤の導入 | [04-testing-infrastructure.md](./guides/04-testing-infrastructure.md) | vitest + React Testing Library によるテスト環境を構築し、主要コンポーネントのテストを書く | ⬜ |
| 5 | Dashboard の遅延読み込み化 | [05-dashboard-lazy-load.md](./guides/05-dashboard-lazy-load.md) | Dashboard を `React.lazy()` で遅延読み込みに変更し、初期バンドルサイズを削減する | ✅ |
| 6 | デッドコードの削除 | [06-dead-code-cleanup.md](./guides/06-dead-code-cleanup.md) | コメントアウトされた旧ログインフロー・ルート定義等を削除する | ✅ |

## 🟡 Priority 2 — コード品質・UX 改善

| # | タイトル | 手順書 | 概要 | 状態 |
|---|---------|--------|------|------|
| 7 | overlayAtom の分割 | [07-overlay-atom-split.md](./guides/07-overlay-atom-split.md) | 巨大な単一アトムを個別アトムに分割し、不要な再レンダリングを抑制する | ✅ |
| 8 | Query Key Factory の導入 | [08-query-key-factory.md](./guides/08-query-key-factory.md) | 散在するクエリキーを一元管理するファクトリパターンを導入する | ⬜ |
| 9 | API 設定の共通化 | [09-api-config-shared.md](./guides/09-api-config-shared.md) | auth と client で重複する API URL 計算を共有設定ファイルに抽出する | ✅ |
| 10 | Service Worker ランタイムキャッシュの導入 | [10-sw-runtime-cache.md](./guides/10-sw-runtime-cache.md) | API レスポンスに StaleWhileRevalidate 戦略を適用し、オフライン体験を向上させる | ⬜ |
| 11 | ErrorFallback の改善 | [11-error-fallback-improvement.md](./guides/11-error-fallback-improvement.md) | 本番環境でのスタックトレース非表示化、エラーログ送信の堅牢化を行う | ✅ |
| 12 | dashboard.tsx からの JSX 分離 | [12-dashboard-store-refactor.md](./guides/12-dashboard-store-refactor.md) | store ファイルに混在する JSX をコンポーネントに移動する | ✅ |
| 13 | 大規模コンポーネントの分割 | [13-large-component-split.md](./guides/13-large-component-split.md) | Dashboard・Timetable 等の巨大コンポーネントをサブコンポーネントに分割する | ⬜ |
| 14 | アクセシビリティ (a11y) 改善 | [14-accessibility.md](./guides/14-accessibility.md) | D&D の aria 属性、画像 alt テキスト、ライブリージョン等を追加する | ⬜ |

## 🟢 Priority 3 — 改善推奨

| # | タイトル | 手順書 | 概要 | 状態 |
|---|---------|--------|------|------|
| 15 | テーマのハードコード値の解消 | [15-theme-hardcoded-values.md](./guides/15-theme-hardcoded-values.md) | `#202020` 等のハードコードカラーをテーマトークンに置き換える | ✅ |
| 16 | global.css の修正 | [16-global-css-fix.md](./guides/16-global-css-fix.md) | タイポ修正、重複セレクタ削除、ダークモード対応を行う | ✅ |
| 17 | ストレージバージョニングの導入 | [17-storage-versioning.md](./guides/17-storage-versioning.md) | Jotai アトムのストレージにバージョン管理を導入し、スキーマ変更時のマイグレーションを可能にする | ⬜ |
| 18 | ルート構造のリファクタリング | [18-route-restructure.md](./guides/18-route-restructure.md) | フラットなルート定義を機能別にネストし、保守性を向上させる | ⬜ |
| 19 | プリキャッシュサイズの最適化 | [19-precache-optimization.md](./guides/19-precache-optimization.md) | 不要な画像を除外してプリキャッシュサイズを削減する | ⬜ |
| 20 | オフラインフォールバックページの作成 | [20-offline-fallback.md](./guides/20-offline-fallback.md) | キャッシュ外 URL アクセス時に表示するオフラインページを作成する | ⬜ |
