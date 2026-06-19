import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const BASE = 'http://127.0.0.1:5173';

function getChapterIds() {
  // 从源码 chapters.ts 中简单提取 id 列表
  const src = readFileSync('/Users/lantian/AI/gameone/game/src/data/chapters.ts', 'utf-8');
  const ids = [];
  // 只匹配 chapters.ts 中顶层章节对象的 id（4 空格缩进），避免误把 hotspot/puzzle 等 id 当作章节
  const re = /^    id:\s*['"]([^'"]+)['"]/gm;
  let m;
  while ((m = re.exec(src))) ids.push(m[1]);
  return [...new Set(ids)];
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  const logs = [];

  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  console.log('加载首页...');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/smoke-intro.png', fullPage: false });

  const ids = getChapterIds();
  console.log('检测到章节:', ids.join(', '));

  // 解锁所有章节并依次访问
  for (const id of ids) {
    await page.evaluate((chapterId) => {
      const raw = localStorage.getItem('renxin-game-storage');
      const state = raw ? JSON.parse(raw) : {};
      state.state = state.state || {};
      if (!state.state.unlockedChapterIds) state.state.unlockedChapterIds = [];
      if (!state.state.unlockedChapterIds.includes(chapterId)) {
        state.state.unlockedChapterIds.push(chapterId);
      }
      state.state.currentChapterId = chapterId;
      state.state.ending = null;
      localStorage.setItem('renxin-game-storage', JSON.stringify(state));
    }, id);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const title = await page.locator('header h1').textContent();
    const heading = await page.locator('main h1, main h2').first().textContent().catch(() => '(no heading)');
    console.log(`[${id}] title=${title} heading=${heading}`);
    await page.screenshot({ path: `/tmp/smoke-${id}.png`, fullPage: false });
  }

  // 尝试触发好结局与坏结局
  for (const ending of ['good', 'bad']) {
    await page.evaluate((e) => {
      const raw = localStorage.getItem('renxin-game-storage');
      const state = raw ? JSON.parse(raw) : {};
      state.state = state.state || {};
      state.state.ending = e;
      localStorage.setItem('renxin-game-storage', JSON.stringify(state));
    }, ending);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const heading = await page.locator('main h1, main h2').first().textContent().catch(() => '(no heading)');
    console.log(`[ending=${ending}] heading=${heading}`);
    await page.screenshot({ path: `/tmp/smoke-ending-${ending}.png`, fullPage: false });
  }

  await browser.close();

  console.log('\n--- 发现的错误 ---');
  if (errors.length === 0) console.log('无页面错误或 console.error');
  else errors.forEach((e) => console.log(e));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
