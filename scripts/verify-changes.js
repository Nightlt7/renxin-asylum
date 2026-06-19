import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:5173';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/game-intro-new.png', fullPage: false });

  // 跳到指认真凶章节
  await page.evaluate(() => {
    const raw = localStorage.getItem('renxin-game-storage');
    const state = raw ? JSON.parse(raw) : {};
    state.state = state.state || {};
    state.state.unlockedChapterIds = ['intro','news','phone','dossier','letter','patients','timeline','deduction'];
    state.state.currentChapterId = 'deduction';
    state.state.hasPainProtection = true;
    state.state.painkillerTakenInChapter = null;
    localStorage.setItem('renxin-game-storage', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: '/tmp/game-accusation.png', fullPage: false });

  // 展开提示按钮，逐层查看
  await page.click('button:has-text("提示")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/game-hint1.png', fullPage: false });
  await page.click('button:has-text("揭示下一级提示")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/game-hint2.png', fullPage: false });
  await page.click('button:has-text("揭示下一级提示")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/game-hint3.png', fullPage: false });

  await browser.close();
  console.log('errors:', errors.length ? errors : 'none');
}

main().catch((err) => { console.error(err); process.exit(1); });
