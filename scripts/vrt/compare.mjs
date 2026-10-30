/** v2/v3 スクリーンショットを pixelmatch で比較し、差分率順にレポート */
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const DIR = path.resolve('./shots');
const DIFF = path.resolve('./diffs');
fs.mkdirSync(DIFF, { recursive: true });

const v2files = fs
  .readdirSync(DIR)
  .filter((f) => f.startsWith('v2__'))
  .sort();

const results = [];
for (const v2name of v2files) {
  const v3name = v2name.replace(/^v2__/, 'v3__');
  const v3path = path.join(DIR, v3name);
  if (!fs.existsSync(v3path)) {
    results.push({ key: v2name.slice(4, -4), pct: null, note: 'v3 missing' });
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(path.join(DIR, v2name)));
  const b = PNG.sync.read(fs.readFileSync(v3path));
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (img) => {
    if (img.width === width && img.height === height) return img;
    const out = new PNG({ width, height, fill: true });
    // 白で埋める
    out.data.fill(255);
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };
  const pa = pad(a);
  const pb = pad(b);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(pa.data, pb.data, diff.data, width, height, {
    threshold: 0.15,
  });
  const pct = (mismatched / (width * height)) * 100;
  const key = v2name.slice(4, -4);
  const sizeNote =
    a.height !== b.height || a.width !== b.width
      ? ` (size v2:${a.width}x${a.height} v3:${b.width}x${b.height})`
      : '';
  results.push({ key, pct, note: sizeNote });
  if (pct > 0.05) {
    fs.writeFileSync(path.join(DIFF, `diff__${key}.png`), PNG.sync.write(diff));
  }
}

results.sort((x, y) => (y.pct ?? 999) - (x.pct ?? 999));
console.log('=== v2 vs v3 差分率 (大きい順) ===');
for (const r of results) {
  console.log(
    `${(r.pct ?? NaN).toFixed(2).padStart(7)}%  ${r.key}${r.note ?? ''}`,
  );
}
