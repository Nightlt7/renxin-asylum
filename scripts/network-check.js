import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:5173';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const failed = [];

  page.on('response', (res) => {
    const status = res.status();
    const url = res.url();
    if (status >= 400 && url.startsWith(BASE)) {
      failed.push(`${status} ${url}`);
    }
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 解锁所有章节并访问，触发图片加载
  const ids = ['intro','news','phone','dossier','letter','patients','timeline','deduction','ending'];
  for (const id of ids) {
    await page.evaluate((chapterId) => {
      const raw = localStorage.getItem('renxin-game-storage');
      const state = raw ? JSON.parse(raw) : {};
      state.state = state.state || {};
      state.state.unlockedChapterIds = Array.from(new Set([...(state.state.unlockedChapterIds || []), chapterId]));
      state.state.currentChapterId = chapterId;
      localStorage.setItem('renxin-game-storage', JSON.stringify(state));
    }, id);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
  }

  await browser.close();

  console.log('--- 失败的网络请求 ---');
  if (failed.length === 0) console.log('无 4xx/5xx 资源请求');
  else failed.forEach((f) => console.log(f));
}

main().catch((err) => { console.error(err); process.exit(1); });
