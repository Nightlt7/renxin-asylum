const { chromium } = require('playwright');
const path = require('path');

const STORAGE_KEY = 'renxin-game-storage';

const makeState = (overrides = {}) => ({
  state: {
    currentChapterId: 'deduction',
    unlockedChapterIds: ['intro','news','phone','dossier','letter','patients','timeline','deduction','ending'],
    collectedClueIds: [],
    solvedPuzzleIds: ['p_intro','p_news','p_phone','p_dossier','p_morse','p_illness','p_timeline'],
    hintLevels: {},
    hasPainProtection: true,
    painkillerTakenInChapter: null,
    ending: null,
    audioEnabled: true,
    audioVolume: 0.5,
    ...overrides,
  },
  version: 0,
});

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const shot = (name) => page.screenshot({ path: path.join(__dirname, `verify-${name}.png`), fullPage: true });

  // 好结局：指认袁枝 + 有疼痛保护
  await page.goto('http://localhost:5173/');
  await page.evaluate(([key, state]) => localStorage.setItem(key, JSON.stringify(state)), [STORAGE_KEY, makeState()]);
  await page.reload();
  await page.waitForSelector('text=指认真凶');
  await shot('deduction');
  await page.click('text=袁枝');
  await page.click('text=提交指控');
  await page.waitForSelector('text=真结局');
  await shot('ending-good');

  // 坏结局 1：指认袁枝但失去疼痛保护
  await page.evaluate(([key, state]) => localStorage.setItem(key, JSON.stringify(state)), [STORAGE_KEY, makeState({
    hasPainProtection: false,
    painkillerTakenInChapter: 'deduction',
  })]);
  await page.reload();
  await page.waitForSelector('text=指认真凶');
  await page.click('text=袁枝');
  await page.click('text=提交指控');
  await page.waitForSelector('text=坏结局');
  await shot('ending-bad-painkiller');

  // 坏结局 2：指认崔哲金
  await page.evaluate(([key, state]) => localStorage.setItem(key, JSON.stringify(state)), [STORAGE_KEY, makeState()]);
  await page.reload();
  await page.waitForSelector('text=指认真凶');
  await page.click('text=崔哲金');
  await page.click('text=提交指控');
  await page.waitForSelector('text=坏结局');
  await shot('ending-bad-wrong');

  await browser.close();
  console.log('ending verification done');
})();
