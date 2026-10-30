/**
 * v2 (port 3001) と v3 (port 3000) の同一ルートを light/dark でスクリーンショット。
 * - 偽JWTで RequireLogin を通過
 * - 外部リクエストは全て abort → 両者を同じ loading/error 状態に固定
 * - アニメーション/トランジション無効化、reducedMotion
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('./shots');
const TARGETS = [
  { name: 'v2', base: 'http://localhost:3001' },
  { name: 'v3', base: 'http://localhost:3000' },
];
const ROUTES = [
  '/login',
  '/dashboard',
  '/status',
  '/timetable',
  '/events',
  '/transit',
  '/library',
  '/library/search',
  '/library/bookmarks',
  '/posts/hatoboard',
  '/classmatch',
  '/classroom',
  '/settings',
  '/settings/account',
  '/settings/theme',
  '/settings/notification',
];
const MODES = ['light', 'dark'];
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

const FREEZE_CSS = `
*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}
`;

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const target of TARGETS) {
  for (const vp of VIEWPORTS) {
    for (const mode of MODES) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: 'reduce',
        colorScheme: mode, // system設定にも合わせる
        deviceScaleFactor: 1,
        locale: 'ja-JP',
        timezoneId: 'Asia/Tokyo',
      });
      // 外部リクエスト遮断 (localhostのみ許可)。/api/ (vite proxy) も遮断し、
      // 偽JWTへの 401 で v3 だけログアウトされるのを防ぐ (v2 は 401 処理が壊れている)
      await context.route('**/*', (route) => {
        const url = new URL(route.request().url());
        // v3 は開発時のみ jotai-devtools の CSS (Mantine) を読み込み、レイアウトが数 px ずれるため空にする
        if (url.pathname.endsWith('jotai-devtools/dist/index.css'))
          return route.fulfill({
            contentType: 'text/javascript',
            body: 'export default {}',
          });
        if (
          url.origin.startsWith('http://localhost:300') &&
          !url.pathname.startsWith('/api/')
        )
          return route.continue();
        return route.abort();
      });
      await context.addInitScript(
        ([m]) => {
          // 認証通過 (atomWithStorage は JSON 文字列。v3 側は素の値から migrate される)
          localStorage.setItem('hato.auth', JSON.stringify('fake.jwt.for-vrt'));
          localStorage.setItem(
            'hato.user',
            JSON.stringify({
              _id: 'vrt-user',
              role: 'user',
              avatar: '',
              email: 'vrt@example.com',
              name: 'VRT テスト',
              type: 'hs',
              grade: '2',
              class: '3',
              course: 'riko',
              userScheduleId: null,
              apiKey: 'vrt-api-key',
              contributionCount: 42,
              createdAt: '2025-04-01T00:00:00.000Z',
            }),
          );
          // カラーモード: v2 chakra / v3 next-themes 両対応
          localStorage.setItem('chakra-ui-color-mode', m);
          localStorage.setItem('theme', m);
          // 時刻固定 (Clockカード等の差分ノイズ除去)
          const fixed = new Date('2026-06-20T12:00:00+09:00').valueOf();
          const OrigDate = Date;
          // eslint-disable-next-line no-global-assign
          Date = class extends OrigDate {
            constructor(...args) {
              if (args.length === 0) super(fixed);
              else super(...args);
            }
            static now() {
              return fixed;
            }
          };
        },
        [mode],
      );

      const page = await context.newPage();
      for (const routePath of ROUTES) {
        const slug = routePath.replaceAll('/', '_').replace(/^_/, '') || 'root';
        const file = path.join(
          OUT,
          `${target.name}__${vp.name}__${mode}__${slug}.png`,
        );
        try {
          await page.goto(target.base + routePath, {
            waitUntil: 'domcontentloaded',
            timeout: 20000,
          });
          await page.addStyleTag({ content: FREEZE_CSS });
          // lazyロード + React Query 収束待ち
          await page.waitForTimeout(2500);
          await page.screenshot({ path: file, fullPage: true });
          process.stdout.write(`ok ${path.basename(file)}\n`);
        } catch (e) {
          process.stdout.write(
            `FAIL ${path.basename(file)}: ${e.message.split('\n')[0]}\n`,
          );
        }
      }
      await context.close();
    }
  }
}
await browser.close();
console.log('capture done');
