const { chromium } = require('playwright');
const path = require('path');

const STORAGE_KEY = 'renxin-game-storage';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const shot = (name) => page.screenshot({ path: path.join(__dirname, `verify-${name}.png`), fullPage: true });

  page.on('console', (msg) => console.log(`[console ${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('text=仁馨精神病院');
  await shot('intro');

  // 完成序章
  await page.click('text=完成整理');
  await page.waitForSelector('text=进入第 1 章');
  await shot('intro-solved');

  // 进入新闻章
  await page.click('text=进入第 1 章');
  await page.waitForSelector('text=案情回顾');
  await shot('news');

  // 解新闻题
  await page.locator('input').first().fill('501会议室');
  await page.click('text=提交');
  await page.waitForSelector('text=已完成本章推理');
  await shot('news-solved');

  // 进入手机章
  await page.click('text=进入第 2 章');
  await page.waitForSelector('text=手机信息梳理');
  await shot('phone');
  await page.click('text=完成整理');

  // 进入卷宗袋
  await page.click('text=进入第 3 章');
  await page.waitForSelector('text=卷宗袋调查');
  await shot('dossier');

  // 拖动照片解密卡到冰箱区域
  const overlay = page.locator('img[alt="照片解密卡"]');
  await overlay.scrollIntoViewIfNeeded();
  const box = await overlay.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 380, box.y + box.height / 2 + 220, { steps: 10 });
  await page.mouse.up();
  await page.waitForSelector('text=发现隐藏线索', { timeout: 5000 });
  await page.click('text=发现隐藏线索');
  await shot('dossier-photo');

  // IC 卡权限拼图：放置一个碎片，回答观察题
  await page.waitForSelector('text=电梯 IC 卡权限碎片');
  await shot('dossier-iccard-progress');
  await page.click('text=2016.04.20 13:50 · 刘 / 初始授权'); // 点击一个碎片
  await page.locator('button:has-text("①")').click(); // 点击 ① 号槽
  await page.click('text=读取记录并回答问题');
  await shot('dossier-iccard-question');
  await page.locator('input[placeholder="输入人名"]').fill('崔哲金');
  await page.click('text=提交');
  await page.waitForSelector('text=已完成本章推理');
  await shot('dossier-iccard');

  // 进入来信
  await page.click('text=进入第 4 章');
  await page.waitForSelector('text=明信片摩尔斯电码');
  await shot('letter');
  await page.locator('input').first().fill('304 fridge brain');
  await page.click('text=解码');

  // 进入病患建档
  await page.click('text=进入第 5 章');
  await page.waitForSelector('text=病人与病症');
  await shot('patients');

  // 填连线：按顺序选择 7 个下拉框
  const illnesses = ['躁狂症', '神经性厌食', '妄想性障碍', '黑暗恐惧', '癔症性漫游症', 'PTSD', '智力残疾'];
  const selects = await page.locator('select').all();
  for (let i = 0; i < illnesses.length && i < selects.length; i++) {
    await selects[i].selectOption({ label: illnesses[i] });
  }
  await page.click('text=提交连线');

  // 进入时间线
  await page.click('text=进入第 6 章');
  await page.waitForSelector('text=11 月 5 日晚的脚步声');
  await shot('timeline');

  // 自动排序时间线
  const correctOrder = [
    '姚欢起夜去洗手间，路过禁闭室被袁枝催眠。',
    '袁枝操纵姚欢唤醒罗昆山到禁闭室门前。',
    '罗昆山被催眠后打开护士站门锁，取出电梯卡和禁闭室钥匙。',
    '柴靖被唤醒，持电梯卡上 5 楼会议室替换游戏机催眠视频。',
    '11 月 6 日晨会播放催眠视频，4 名医护被催眠。',
    '早操时间病人下楼，姚欢用钥匙放出袁枝。',
    '袁枝带崔哲金上天台，纵火后将其推下楼。',
  ];
  for (let targetIdx = 0; targetIdx < correctOrder.length; targetIdx++) {
    const targetText = correctOrder[targetIdx];
    let placed = false;
    while (!placed) {
      const rows = await page.locator('[data-testid="timeline-row"]').all();
      const currentIdx = rows.findIndex(async (row) => await row.getAttribute('data-event') === targetText);
      // findIndex with async predicate doesn't work, use evaluate
      const idx = await page.evaluate((text) => {
        const all = document.querySelectorAll('[data-testid="timeline-row"]');
        for (let i = 0; i < all.length; i++) {
          if (all[i].getAttribute('data-event') === text) return i;
        }
        return -1;
      }, targetText);
      if (idx === targetIdx) {
        placed = true;
      } else {
        // click up on the row at idx
        const row = page.locator('[data-testid="timeline-row"]').nth(idx);
        await row.locator('button').first().click();
      }
    }
  }
  await page.click('text=确认顺序');
  await page.waitForSelector('text=已完成本章推理');
  await shot('timeline-solved');

  // 进入指认
  await page.click('text=进入第 7 章');
  await page.waitForSelector('text=指认真凶');
  await shot('deduction');

  // 指认错误嫌疑人，观察坏结局
  await page.click('text=崔哲金');
  await page.click('text=提交指控');
  await page.waitForSelector('text=坏结局');
  await shot('ending-bad');

  // 重置并验证好结局：需要解时间线，较复杂；这里只截图重置后的首页
  await page.click('text=重新开始');
  await page.waitForSelector('text=完成整理');
  await shot('reset');

  await browser.close();
  console.log('verify done');
})();
