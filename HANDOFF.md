# 仁馨精神病院游戏交接

更新时间：2026-06-19

## 2026-06-19 封装桌面与安卓应用

- 目标：将 Web 游戏封装为可在 macOS、Windows、Android 上运行的本地应用，并生成安装包。
- 修改文件：
  - 新增 `electron/main.cjs`：Electron 主进程，加载打包后的 `dist/index.html`，窗口尺寸 1280×800。
  - 新增 `vite.electron.config.ts`：Electron 打包使用 `base: './'`，适配 `file://` 协议。
  - 新增 `capacitor.config.ts`：Capacitor 配置，webDir 指向 `dist`。
  - `package.json`：
    - 添加 `electron`、`electron-builder`、`@capacitor/core`、`@capacitor/cli`、`@capacitor/android` 依赖。
    - 添加 `electron:pack`、`electron:pack:mac`、`electron:pack:win` 打包脚本。
    - 添加 `build` 字段配置 electron-builder（dmg / nsis）。
  - `.gitignore`：排除 `release/`、`android/` 等大型生成目录。
- 生成的安装包（位于 `release/`）：
  - macOS Apple Silicon：`仁馨精神病院-1.0.0-arm64.dmg`（约 248 MB）
  - macOS Intel：`仁馨精神病院-1.0.0.dmg`（约 250 MB）
  - Windows：`仁馨精神病院 Setup 1.0.0.exe`（约 227 MB）
  - Android：`仁馨精神病院-1.0.0-android.apk`（约 134 MB）
- 环境说明：
  - 在本地 macOS 上安装 OpenJDK 21 与 Android SDK 后完成 Android APK 构建。
  - macOS / Windows 安装包由 electron-builder 在本地直接构建完成。
  - 安装包未进行代码签名，macOS 打开时可能提示“无法验证开发者”，需要在“系统设置 → 隐私与安全性”中允许；Windows 打开时可能提示 SmartScreen，点击“更多信息 → 仍要运行”。
- 验证：
  - `npm run electron:pack:mac`：成功生成 dmg。
  - `npm run electron:pack:win`：成功生成 exe。
  - `./gradlew assembleDebug`：成功生成 APK。
- 当前状态：macOS、Windows、Android 三端安装包均已生成，封装完成。

## 2026-06-19 修复 GitHub Pages 图片加载问题

- 目标：解决部署到 GitHub Pages 子路径后，游戏内图片无法显示的问题。
- 根因：源码中图片路径硬编码为 `/assets/images/...`，在 `/renxin-asylum/` 子路径下浏览器会请求 `/assets/images/...`，导致 404。
- 修改文件：
  - 新增 `src/utils/imagePath.ts`：根据 `import.meta.env.BASE_URL` 生成图片路径，自动适配 `dev` 根路径与 GitHub Pages 子路径。
  - `src/data/chapters.ts`：`img()` 辅助函数改用 `imagePath()`。
  - `src/data/clues.ts`：所有线索图片路径改用 `imagePath()`。
  - `src/data/puzzles.ts`：所有谜题图片与 overlay 图片路径改用 `imagePath()`。
  - `.gitignore`：补充 `.vite/` 缓存目录，避免误提交 Vite 优化缓存。
- 验证：
  - `npm run build:deploy`：通过。
  - 对线上站点运行 Playwright 网络检查：全部 9 个章节与双结局均无 4xx/5xx 资源请求。
  - 直接 curl 线上图片地址返回 HTTP 200。
- 当前状态：GitHub Pages 子路径下图片已正常加载，游戏可正常游玩。

## 2026-06-19 正式上线 GitHub Pages

- 目标：将游戏保存到 GitHub 仓库并部署为可通过专属 URL 访问的静态站点。
- 操作记录：
  - 初始化本地 Git 仓库（`git init`）。
  - 创建 `.gitignore`，排除 `node_modules/`、`dist/`、`.env`、`.DS_Store` 及 `public/assets/images-original/` 等大文件。
  - 配置 `vite.config.ts` 的 `base: '/renxin-asylum/'`，适配 GitHub Pages 项目站点路径。
  - 创建 `.github/workflows/deploy.yml`，使用 `peaceiris/actions-gh-pages` 在每次 push 到 `main` 时自动构建并推送到 `gh-pages` 分支。
  - 创建 GitHub 仓库 `Nightlt7/renxin-asylum` 并推送源码。
  - 手动从 `dist/` 创建并推送 `gh-pages` 分支，然后通过 GitHub REST API 启用 Pages（source: `gh-pages` branch）。
  - 验证站点可访问：curl 返回 HTTP 200。
- 上线地址：
  - **游戏网址**：https://nightlt7.github.io/renxin-asylum/
  - **GitHub 仓库**：https://github.com/Nightlt7/renxin-asylum
- 后续更新方式：在 `main` 分支修改代码并 `git push origin main`，GitHub Actions 会自动重新构建并部署。
- 当前状态：游戏已成功上线，可通过专属 URL 直接访问。

## 2026-06-19 上线前最终调整：放大作者水印

- 目标：根据作者反馈，将右下角水印字号调大，随后准备上线。
- 修改文件：
  - `src/App.tsx`：作者水印从 `text-[10px]` 调整为 `text-sm`，并略微增加字间距（`tracking-wider`）与默认透明度（40%），位置微调至 `bottom-4 right-4`。
- 验证：
  - `npm run build:deploy`：通过，dist/ 已更新。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：作者水印大小已调整，最终验证通过，可正式上线。

## 2026-06-19 添加作者水印

- 目标：在游戏界面中加入作者署名水印“岚天 作品”。
- 修改文件：
  - `src/App.tsx`：在应用最外层右下角添加固定水印，使用 `pointer-events-none` 避免遮挡点击，默认透明度 30%，悬停时提升至 60%，不干扰游戏内容。
- 验证：
  - `npm run build`：通过（仅 Vite chunk 体积警告）。
  - `npm run build:deploy`：通过，dist/ 已更新。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：作者水印已加入，游戏可准备上线。

## 2026-06-19 体验细节调整（摩斯密码重复、打乱顺序、尾声 UI、指认流程）

- 目标：根据试玩反馈消除重复答案、增加谜题随机性、改进尾声 UI 可关闭性、简化最终指认流程。
- 修改文件：
  - `src/data/chapters.ts`：
    - 第 4 章门槛问题从“明信片摩尔斯电码谜底是什么？”改为“密码盘解密后的单词是什么？它指向什么？”，答案改为 `brain/大脑组织`，避免与摩尔斯谜题都输入 `304 fridge brain`。
    - 第 7 章删除门槛问题，指认真凶只保留 `p_accusation` 一个问题“真凶是谁”。
  - `src/components/puzzles/ConnectPuzzle.tsx`：新增 `shuffleArray` 工具函数，使用 `useMemo` 随机打乱病人列表与病症下拉选项顺序，提升病例连线挑战。
  - `src/components/puzzles/TimelinePuzzle.tsx`：新增 `shuffleArray` 工具函数，使用 `useMemo` 随机打乱待选事件卡片初始顺序，避免玩家按原文顺序直接拖拽。
  - `src/components/EpilogueCard.tsx`：重新设计角色尾声面板：
    - 增加带标题和关闭按钮的顶部栏。
    - 列表区域独立滚动，卡片带头像与悬停效果。
    - 底部提供“收起”与“查看真相解析”按钮，解决原先无法关闭的问题。
  - `src/components/EndingView.tsx`：为 `EpilogueCard` 传入 `onClose` 与 `onContinue`，点击后均进入真相解析阶段。
- 验证：
  - `npm run build`：通过（仅 Vite chunk 体积警告）。
  - `npm run build:deploy`：通过，dist/ 已更新。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：5 处体验反馈已全部调整并验证通过，可继续试玩。

## 2026-06-19 修复第 1 章重复输入与第 3 章平面图标记偏差

- 目标：消除第 1 章“501 会议室”重复输入，并修正第 3 章平面图上关键地点标记与实际位置不统一的问题。
- 修改文件：
  - `src/data/chapters.ts`：
    - 第 1 章 `advanceQuestion` 改为询问“11·6 纵火案共造成多少人死亡？除端坐会议室的 4 人外，还有谁？”，答案接受“5/五人/5人/崔哲金”，避免与同一章拼图后的问答题重复。
    - 第 3 章 `hotspots` 中“天台广告牌”热点坐标从错误顶部调整到右下角天台区域，并新增“501 会议室”热点。
  - `src/data/puzzles.ts`：
    - 修正 `p_hidden_floorplan` 三个目标坐标：天台广告牌、501 会议室、309 禁闭室，使其与平面图实际位置一致。
- 验证：
  - `npm run build`：通过（仅 Vite chunk 体积警告）。
  - `npm run build:deploy`：通过，dist/ 已更新。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：第 1 章重复输入问题已消除，第 3 章平面图标记已精确对应实际位置，可继续试玩或准备上线。

## 2026-06-19 结局后真相解析环节

- 目标：在达成结局之后增加一个完整的“真相解析”环节，把故事梗概、人物动机、核心诡计、人物关系、来因去果串联起来告诉玩家。
- 修改文件：
  - `src/data/truth.ts`：新增 `storyAnalysis` 对象，包含：
    - `summary`：故事梗概
    - `motiveChain`：曹怀敬、刘美汐、崔哲金、袁枝、叶臻五人的动机链条
    - `coreTrick`：袁枝隔空催眠操控三名病人完成纵火与替换视频的核心诡计
    - `relationships`：四组关键人物关系
    - `causeAndEffect`：六条来因去果
  - `src/components/TruthRecap.tsx`：
    - 新增“真相解析”标签页作为默认页，展示上述五部分内容。
    - 保留“案发夜事件链”“完整时间线”“九题复盘”三个原有标签。
  - `src/components/EndingView.tsx`：
    - 将结局流程整理为 5 个阶段：结局文字 → 第二段剧情 → 角色尾声提示 → 角色尾声 → 真相解析。
    - “真相解析”作为最后一个必经环节，在角色尾声后通过“查看真相解析”按钮进入。
    - 进入真相解析时调用 `viewTruthRecap()` 记录状态。
- 验证：
  - `npm run build`：通过（仅 Vite chunk 体积警告）。
  - `npm run build:deploy`：通过，dist/ 已更新。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：结局后真相解析环节已完成并集成进结局流程，可继续后续工作或保持当前状态准备上线。

## 2026-06-19 封装上线：部署版 dist 与部署建议

- 目标：将游戏打包为可部署的静态站点，检查资源路径、index.html、图片/音频完整性，并给出通用静态部署方案。
- 修改文件：
  - `index.html`：标题改为“仁馨精神病院”，lang 改为 `zh-CN`，新增 description meta。
  - `package.json`：新增 `build:deploy` 脚本，构建后自动移除 `public/assets/images-original` 备份目录。
- 打包结果：
  - 运行 `npm run build:deploy` 后输出到 `dist/`。
  - `dist/index.html` 正确引用 `/favicon.svg`、`/assets/index-*.js`、`/assets/index-*.css`。
  - `dist/assets/images/` 含 140 张已处理图片，约 150 MB；原始图片备份已排除，部署包约 151 MB。
  - 音频由 Tone.js 实时生成，无需额外音频资源文件。
- 验证：
  - `npm run build:deploy`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 部署建议：
  - **Vercel / Netlify**：直接拖拽 `dist/` 或连接 Git 仓库并设置 Build Command 为 `npm run build:deploy`，Publish Directory 为 `dist/`。默认根路径部署，无需额外 base 配置。
  - **GitHub Pages**：若仓库名为 `username.github.io`，直接推送 `dist/` 到根目录即可；若项目站点为 `username.github.io/repo-name/`，需在 `vite.config.ts` 中设置 `base: '/repo-name/'`，再重新构建。
  - **其他静态服务器**：将 `dist/` 内容上传至任意支持静态文件的 Web 服务器（Nginx、Apache、Cloudflare Pages 等），确保 `/assets/images/` 路径可访问。
- 当前状态：游戏已完成最后一批角色互动优化并封装为可部署静态站点，核心内容与双结局完整保留，可上线。

## 2026-06-19 最后一批角色互动优化

- 目标：在保留核心内容与双结局的前提下，把角色访谈入口铺到更多章节，并增加按线索/章节进度解锁的深层话题与关键章节短对话。
- 修改文件：
  - `src/data/chapters.ts`：
    - 第 2 章《叶臻的手机》新增 `interviewCharacterIds: ['liushi', 'wangmin']`。
    - 第 3 章《平面图与卷宗袋》新增 `interviewCharacterIds: ['cuizhejin', 'caohuaijing']`，并新增 4 段叙事节拍（曹怀敬/崔哲金对峙感）。
    - 第 4 章《来信与明信片》新增 `interviewCharacterIds: ['cuizhejin']`，并新增 3 段叙事节拍（拆信、崔哲金留言、写明信片的闪回）。
    - 第 7 章《指认真凶》新增 `interviewCharacterIds: ['yuanzhi']`，并在现有叙事节拍中插入袁枝对峙片段。
  - `src/data/characters.ts`：
    - 崔哲金新增“你把大脑组织藏在哪？”（需明信片线索）、“曹怀敬为什么排挤你？”（需曹怀敬原始记录本线索）。
    - 曹怀敬新增“崔哲金发现了什么？”“刘美汐对袁枝做了什么？”“11·6 那天你知情吗？”。
    - 刘美汐新增“袁枝口中的‘姐姐’是你吗？”“5 号晚上为什么把他关禁闭室？”。
    - 王敏新增“仁馨的止痛药有问题吗？”“你早就知道这些实验？”。
    - 刘师姐新增“你还记得什么细节？”“你是怎么离开仁馨的？”。
    - 袁枝新增“你为什么要杀崔哲金？”“你催眠了所有人？”“崔哲金最后说了什么？”三个第七章对峙话题。
- 验证：
  - `npm run build`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：最后一批角色互动优化已完成，核心内容与双结局保留完整，可进入打包部署阶段。

## 2026-06-19 补跑完整验证

- 目标：补做上一会话被安全分类器临时拦截的 `npm run build`、冒烟测试与网络检查，确认当前代码无回归。
- 验证结果：
  - `npm run build`：通过（仅 Vite chunk 体积警告，不影响构建）。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：当前代码构建与核心验证通过，可继续最后一批角色互动优化与打包部署。

## 2026-06-19 章节推理门槛与第 6 章时间线交互优化

- 目标：解决“章节推进太顺”和“第 6 章时间线排序交互枯燥、提示不直观”的问题。
- 修改文件：
  - `src/types/game.ts`：
    - 新增 `AdvanceQuestion` 类型与 `Chapter.advanceQuestion` 字段。
    - `Puzzle` 类型新增可选 `timeSlots` 字段。
  - `src/store/gameStore.ts`：
    - 新增 `answeredAdvanceQuestionIds` 与 `answerAdvanceQuestion(chapterId)`，记录已答对的章节门槛问题，加入持久化。
  - `src/data/chapters.ts`：
    - 为序章、第 1–7 章全部配置 `advanceQuestion`，每个问题都提供 4 级提示，第 4 级直接给出答案。
    - 答案支持多选（如“4楼/4F”），输入任意一个即算正确。
  - `src/components/HintButton.tsx`：
    - 拆出通用 `HintPanel` 组件，`HintButton` 改为对其包装；`ChapterView` 中的门槛问题可直接复用 `HintPanel`。
  - `src/components/ChapterView.tsx`：
    - 谜题已解后，若存在未答对的 `advanceQuestion`，显示门槛问题输入框与 4 级提示面板。
    - 答对后自动解锁下一章并显示“进入下一章”按钮；答错时调用 `recordWrongAttempt` 并显示 `WrongFeedback`。
  - `src/data/puzzles.ts`：
    - 重写 `p_timeline`：`events` 改为更短的卡片文案；新增 `timeSlots`：`['23:30','00:00','00:30','01:00','08:30','09:00','09:30']`；`hints` 改为按时间点描述动作，第 4 级提示直接给出完整对应关系。
  - `src/components/puzzles/TimelinePuzzle.tsx`：
    - 从“上下箭头排序长文本”改为“拖拽事件卡片到时间槽”。
    - 左侧显示待选事件，右侧显示时间槽；拖拽放置、点击移除、槽位间可拖拽交换。
    - 保留错误抖动与 `WrongFeedback`。
- 验证：
  - `npx tsc -b`：通过。
  - `npx vite build`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`、`scripts/network-check.js`：当前被安全分类器临时拦截，恢复后立即补做验证。
- 当前状态：章节推理门槛与第 6 章时间线交互重做已完成，核心构建通过，冒烟/网络测试待补做。

## 2026-06-19 结局情感演出与角色尾声（第三批·沉浸感增强）

- 目标：强化好/坏结局的情感冲击力，并给关键角色一个“故事收束”。
- 修改文件：
  - `src/data/truth.ts`：
    - 在 `truth` 对象中新增 `epilogues` 数组，记录袁枝、7 名病人、崔哲金、叶臻等角色的结局后去向，内容基于原作真相解析。
  - `src/components/EndingView.tsx`：
    - 结局改为分阶段演出：先显示基础结局文字，点击“继续”后进入第二阶段剧情。
    - 好结局第二阶段：袁枝归还原始记录本的对白、叶臻接过记录本时的心理描写、崔哲金写在末页的歉意。
    - 坏结局第二阶段：袁枝推叶臻坠楼前的对话、坠落过程意识流、与崔哲金相同的死法。
    - 坏结局进入第二阶段后，外层容器应用轻微模糊与变暗，模拟意识消散。
    - 第二阶段后新增“查看角色尾声”按钮，点击展开 `EpilogueCard`。
  - `src/components/EpilogueCard.tsx`（新建）：
    - 展示 `truth.epilogues` 中所有角色的尾声卡片，每个卡片包含角色头像、名称与去向说明。
- 验证：
  - `npx tsc -b`：通过。
  - `npx vite build`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`、`scripts/network-check.js`：当前被安全分类器临时拦截，恢复后立即补做验证。
- 当前状态：第三批“结局情感演出与角色尾声”代码已完成，核心构建通过，冒烟/网络测试待补做。

## 2026-06-19 章节叙事节拍与记忆闪回（第二批·沉浸感增强）

- 目标：让章节推进更像“故事章节”，在玩家进入调查前先通过叙事节拍建立情绪与情境。
- 修改文件：
  - `src/types/game.ts`：
    - 新增 `StoryBeatType` 与 `StoryBeat` 类型；`Chapter` 新增可选 `storyBeats` 字段。
  - `src/data/chapters.ts`：
    - 为序章、第 2 章、第 5 章、第 7 章编写 `storyBeats`，包含 `narrative`（叙事）、`innerThought`（叶臻内心独白）、`flashback`（记忆闪回）、`dialogue`（角色对话）四种节拍。
  - `src/components/StoryBeatPlayer.tsx`（新建）：
    - 顺序播放章节叙事节拍，支持“继续”与“跳过”。
    - `flashback` 使用 sepia 旧照片滤镜；`innerThought` 使用斜体与淡色；`dialogue` 显示角色头像与气泡。
    - 叙事文本使用打字机效果；角色对话直接显示。
  - `src/store/gameStore.ts`：
    - 新增 `viewedStoryBeatIds` 与 `viewStoryBeat(beatId)`，已播放节拍不再自动重复播放。
    - 新状态加入 `persist` 持久化。
  - `src/components/ChapterView.tsx`：
    - 章节转场后，若存在未播放的 `storyBeats`，先播放叙事节拍，再显示资料与谜题。
    - 章节标题旁增加“回放本章叙事”按钮，供玩家随时重看。
- 验证：
  - `npx tsc -b`：通过。
  - `npx vite build`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`、`scripts/network-check.js`：当前被安全分类器临时拦截，恢复后立即补做验证。
- 当前状态：第二批“章节叙事节拍与记忆闪回”代码已完成，核心构建通过，冒烟/网络测试待补做。

## 2026-06-19 角色档案与交互式访谈系统（第一批·沉浸感增强）

- 目标：回应“游戏性/故事沉浸感不足”的反馈，让玩家通过角色档案、交互式访谈和人物关系网“认识”角色，而不是只看静态资料。
- 修改文件：
  - `src/data/characters.ts`：
    - 扩展 `Character` 类型，新增 `backstory`（人物小传）、`personality`（性格标签）、`relations`（关键关系）与 `interviewTopics`（交互式访谈话题）。
    - 为全部 13 名角色（玩家 + 7 名病人 + 5 名关键 NPC）补充基于原作资料的小传、性格与关系。
    - 为 7 名病人和 5 名 NPC 编写多话题访谈对话，支持按章节/线索/谜题解锁；原有 13 条访谈补充线索仍通过对话解锁。
  - `src/components/DialogueView.tsx`：
    - 从“静态文本列表”重构为“话题选择 + 对话气泡 + 打字机效果”的交互式访谈。
    - 顶部显示角色头像、身份、性格标签；话题列表按解锁条件过滤，未查看话题显示“新”。
    - NPC 台词使用打字机效果，玩家台词直接显示；支持“跳过打字”与“继续”。
    - 对话中解锁线索时显示绿色提示，并自动收入线索本。
  - `src/components/CharacterProfile.tsx`（新建）：
    - 展示角色头像、身份、性格标签、人物小传、关键关系网。
    - 底部提供“访谈该角色”入口，可从档案跳转到访谈。
  - `src/store/gameStore.ts`：
    - 新增 `viewedDialogueTopicIds`、`unlockedCharacterProfileIds` 状态与对应 actions。
    - 新状态加入 `persist` 持久化，向后兼容旧存档。
  - `src/components/ClueNotebook.tsx` / `src/components/ClueBoard.tsx`：
    - 线索本列表与推理墙中的角色头像点击改为打开“角色档案”。
    - 每个有访谈的角色旁增加“访谈”按钮，点击打开交互式访谈。
  - `src/components/ChapterView.tsx`：
    - 当章节配置了 `interviewCharacterIds` 时，在文档图片后渲染“本章可访谈角色”面板。
    - 第 5 章《病患建档》已配置 7 名病人的访谈入口。
  - `src/types/game.ts`：
    - `Chapter` 类型新增可选 `interviewCharacterIds?: string[]`。
  - `src/data/chapters.ts`：
    - 第 5 章 `patients` 增加 `interviewCharacterIds`。
  - `src/components/TypewriterText.tsx`：
    - 新增可选 `onDone` callback，并用 ref 避免依赖不稳定导致重复触发。
- 验证：
  - `npx tsc -b`：通过（等价于 `npm run build` 的 TypeScript 阶段）。
  - `npx vite build`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`、`scripts/network-check.js`：当前被安全分类器临时拦截，恢复后立即补做验证；5173 端口被旧进程占用，新 dev server 实际运行在 5174。
- 当前状态：第一批“角色档案与交互式访谈系统”代码已完成，核心构建通过，冒烟/网络测试待补做。

## 2026-06-19 图片放大交互修复（第四批）

- 目标：修复图片放大后过大、关闭按钮难找的问题，并增加双击放大/缩小与拖拽平移，提升证据查看体验。
- 修改文件：
  - `src/components/DocumentImage.tsx`：
    - 放大模态框中图片默认限制为 `max(92vw, 1200px)` × `max(82vh, 900px)`，初始大小适中并居中。
    - 顶部固定悬浮工具栏，始终显示缩放比例、放大/缩小按钮、关闭按钮，避免被大图遮挡。
    - 新增**双击图片放大/缩小**；放大后可通过 Framer Motion drag 拖拽平移查看细节。
    - 底部弹出 3 秒操作提示，告诉玩家如何缩放与拖拽。
    - 保持原有热点叠加和热点弹窗功能。
  - `src/App.tsx`：
    - 移除 `currentChapter` 的非空断言，对不存在的章节 ID 渲染“章节未 found”友好提示并提供返回序章按钮，增强防御性。
  - `scripts/smoke-test.js`：
    - 修复章节 ID 提取正则：此前会误把 `hotspot.id` 等嵌套 id 当作章节，导致 `intro_painkiller` 被当作章节访问而崩溃；现只匹配 4 空格缩进的顶层章节 `id`。
- 验证：
  - `npm run build`：通过（仅 Vite chunk 体积警告）。
  - `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
  - Playwright 手动截图确认：默认放大视图图片居中、工具栏可见；双击后放大到 250% 可看清报纸文字。
- 当前状态：图片放大交互 bug 已修复，验证通过，可继续后续优化。

## 2026-06-19 角色代入感与结局真相复盘（第一批）

- 目标：回应“更像网页而非游戏”的反馈，通过角色身份卡、当前目标提示、结局真相复盘建立角色扮演感与故事完整性。
- 修改文件：
  - `src/types/game.ts`：`Chapter` 类型新增可选 `objective` 字段。
  - `src/data/chapters.ts`：为全部 8 个非结局章节增加 `objective` 当前目标文案。
  - `src/data/player.ts`（新建）：定义玩家角色档案（叶臻/崔诣、身份、任务、特质）。
  - `src/components/PlayerIdentityCard.tsx`（新建）：序章自动弹出的角色档案弹窗，含头像、身份/任务/特质打字机效果；顶部菜单增加“档案”按钮可随时回看。
  - `src/App.tsx`：顶部增加“档案”按钮、当前目标提示条；接入 `PlayerIdentityCard` 自动显示逻辑。
  - `src/components/TruthRecap.tsx`（新建）：结局页真相解析组件，分“案发夜事件链 / 完整时间线 / 九题复盘”三栏。
  - `src/components/EndingView.tsx`：增加“查看真相解析 / 收起真相解析”按钮，接入 `TruthRecap`。
  - `src/store/gameStore.ts`：新增 `hasViewedIdentityCard`、`hasViewedTruthRecap` 状态与 `viewIdentityCard()`、`viewTruthRecap()` 动作。
- 验证：
  - `npm run build`：通过。
  - `scripts/smoke-test.js`：全章节与双结局渲染正常，无错误。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：第一批“角色代入 + 真相复盘”代码已完成并通过验证。

## 2026-06-19 推理逻辑链（第二批）

- 目标：让玩家解谜后能看到“从线索到答案”的完整推理过程。
- 修改文件：
  - `src/types/game.ts`：`Puzzle` 类型新增可选 `solutionNotes?: string[]`。
  - `src/data/puzzles.ts`：为全部 15 个谜题（含子谜题）补充 `solutionNotes`。
  - `src/components/SolutionNotes.tsx`（新建）：可折叠的推理回顾组件。
  - `src/components/ChapterView.tsx`：谜题已解锁后显示 `SolutionNotes`。
  - `src/components/puzzles/CompoundPuzzle.tsx`：复合谜题每完成一步先显示该步推理回顾，再进入下一步。
- 验证：
  - `npm run build`：通过。
  - `scripts/smoke-test.js`：全章节与双结局渲染正常，无错误。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：第二批“推理逻辑链”代码已完成并通过验证。

## 2026-06-19 NPC 对话与场景隐藏热点（第三批）

- 目标：增加角色互动与可探索的隐藏内容，让体验更像“游戏”。
- 修改文件：
  - `src/types/game.ts`：新增 `Hotspot` 类型与 `Chapter.hotspots` 字段。
  - `src/data/characters.ts`：为 13 名角色增加 `dialogues` 访谈对话，部分对话解锁线索。
  - `src/data/clues.ts`：新增 13 条“访谈补充”线索。
  - `src/data/chapters.ts`：为序章、第 3 章、第 4 章、第 5 章增加可点击热点。
  - `src/components/DialogueView.tsx`（新建）：角色对话弹窗，打开时自动将对话解锁的线索收入线索本。
  - `src/components/ClueNotebook.tsx` / `src/components/ClueBoard.tsx`：线索本中的角色头像可点击，打开对应角色访谈。
  - `src/components/DocumentImage.tsx`：支持图片热点叠加，点击热点弹出调查说明。
  - `src/components/ChapterView.tsx`：按图片下标将热点传入 `DocumentImage`。
- 验证：
  - `npm run build`：通过。
  - `scripts/smoke-test.js`：全章节与双结局渲染正常，无错误。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：第三批“NPC 对话与场景隐藏热点”代码已完成并通过验证。

## 2026-06-19 补去卷宗袋图片水印

- 问题：第 3 章《平面图与卷宗袋》中“陈旧的病房照片”p1–p8 与“电梯 IC 卡记录碎片拼图纸”p1、p2 仍带有右下角“夸克扫描王”水印。
- 处理：
  - 新增 `scripts/fix-target-watermark.py`：针对底部带白边的图片，检测白色页边并裁剪掉水印区域；对全白背景的 IC 卡 p2 使用模板匹配+邻近色填充。
  - 从 `public/assets/images-original/` 还原原始文件后重新处理，覆盖保存到 `public/assets/images/`。
  - 病房照片 p1–p8：裁剪底部约 117–123px 的白边，保留病房画面主体。
  - IC 卡拼图纸 p1：裁剪底部 240px 白边；p2：填充右下角水印区域，保留全部 8 块碎片。
- 验证：
  - `npm run build`：通过。
  - `scripts/smoke-test.js`：全章节与双结局渲染正常，无错误。
  - `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：第 3 章卷宗袋相关图片水印已清除。

## 2026-06-19 探索/收集反馈增强

- 目标：在保留核心内容与双结局的前提下，通过线索收集的即时反馈与未读提示提升探索感和节奏。
- 修改文件：
  - `src/store/gameStore.ts`：新增 `seenClueIds` 与 `markCluesSeen()`，用于追踪哪些已收集线索已被玩家在线索本中查看过。
  - `src/components/DiscoveryToast.tsx`：新组件，发现线索时从右下角弹出绿色提示卡片，显示线索标题与来源，2.5 秒后自动消失。
  - `src/components/ChapterView.tsx`：收集线索时触发 `DiscoveryToast`。
  - `src/components/App.tsx`：当存在未读线索（已收集但不在 `seenClueIds` 中）时，顶部“线索本”按钮显示脉冲红点。
  - `src/components/ClueNotebook.tsx`：打开时高亮新线索；关闭时调用 `markCluesSeen()` 将当前已收集线索标记为已读。
  - `src/components/ClueBoard.tsx`：推理墙与列表视图中的新线索卡片显示绿色边框/阴影和“新”标签。
- 验证：
  - `npm run build`：通过（仍有 Vite chunk 体积警告，不影响构建）。
  - 启动 dev server（`npm run dev -- --host 127.0.0.1`）后运行 `scripts/smoke-test.js`：全部 9 个章节与双结局渲染正常，无页面错误、无 console.error。
  - 运行 `scripts/network-check.js`：无 4xx/5xx 资源请求。
- 当前状态：核心内容与双结局完整保留；本批“探索/收集反馈”优化已完成。

## 2026-06-18 发布前审计 + 体验优化

- `npm run build`：通过（仅 Vite chunk 体积警告，不影响构建）。
- 启动 dev server 后使用 Playwright 冒烟测试：所有 9 个章节与双结局均可正常渲染，无页面错误、无 console.error、无 4xx/5xx 资源请求。
- 新增辅助脚本：
  - `scripts/smoke-test.js`：逐章节渲染检查。
  - `scripts/network-check.js`：全章节资源加载检查。
  - `scripts/verify-changes.js`：带截图的修改验证。
- 本次审计未发现阻塞通关或明显影响理解的错误。

### 本轮优化（2026-06-18 / 06-19）

1. **背景音乐**：`src/hooks/useAudio.ts`
   - 替换原先的低频嗡鸣 + 粉噪声，改为 A 小调悬疑旋律循环。
   - 加入铺底 Pad、主旋律、低音贝斯和持续低频嗡鸣，节奏 60 BPM，营造压抑氛围。
   - 新增 3 组旋律/和弦/低音变奏，每 4 小节轮播一次，并随机加入紧张装饰长音，减少单调感。
2. **线索提示**：`src/data/puzzles.ts`
   - 优化 `p_news`、`p_dossier`、`p_iccard`、`p_illness`、`p_timeline`、`p_accusation` 的 4 级提示。
   - 尤其最后一章「指认真凶」提示更精确：先排除法、再点明关键特征、再给动机与证据链、最后给答案。
   - 所有谜题的第 4 级提示均直接给出答案，第 3 章最终提示明确写出“大脑组织”与“崔哲金”。

3. **小改动 1–5 已完成**：
   - **章节转场动画**：新增 `src/components/ChapterTransition.tsx`，每章进入时显示 1.4 秒标题卡并淡入淡出。
   - **音效反馈**：`useAudio.ts` 新增 `playAdvance` 并优化 `playError`；进入下一章有专属上升和弦，答错有不协和下行音。
   - **图片放大查看**：`DocumentImage.tsx` 已支持点击全屏放大，放大图标默认可见、更易发现。
   - **线索收集动画**：`ChapterView.tsx` 线索收入后有绿色边框闪烁、对勾图标和文字变绿。
   - **叙事文字打字机效果**：新增 `src/components/TypewriterText.tsx`，章节叙事逐字出现并带光标。

4. **人物画像/剪影（步骤 6）**：
   - 新增 `src/data/characters.ts`：定义 7 名病人、关键 NPC（崔哲金、曹怀敬、刘美汐、王敏、陈志杰、刘师姐）与玩家叶臻的配色、剪影类型与别名。
   - 新增 `src/components/CharacterAvatar.tsx`：按角色生成圆形头像/剪影，支持 `sm`/`md`/`lg`/`xl` 与姓名展示。
   - 集成位置：
     - `ClueNotebook`：每条线索顶部自动匹配相关角色头像。
     - `ConnectPuzzle`（病人与病症连线）：每位病人名前显示头像。
     - `AccusationPuzzle`（指认真凶）：每个嫌疑人按钮内显示头像。
     - `TimelinePuzzle`（时间线排序）：事件前自动匹配角色头像。
   - 验证：`npm run build` 通过；`scripts/smoke-test.js` 全章节渲染无错误。

4.5. **Bug 修复（2026-06-19）**：
   - **图片放大定位**：`ChapterView.tsx` 的 `motion.div` 原本带 `filter: blur(...)`，导致内部 `position: fixed` 的放大图层定位到滚动容器顶部。已移除 filter，放大 modal 现在正确居中于当前视口。

5. **线索板/推理墙（步骤 7）**：
   - 新增 `src/components/ClueBoard.tsx`：把线索本从列表升级为可视化推理墙。
   - 支持：
     - **拖拽**：线索卡片可在画布上自由拖动，位置保存在 `localStorage`。
     - **连线**：点击“连线模式”后依次点选两张线索建立连线，连线中点可删除。
     - **分组**：按标签自动归入“人物/案件/地点/时间/机制/物品/其他”列，每张卡片可用下拉框切换分组。
   - `ClueNotebook.tsx` 改为默认显示推理墙、保留列表视图切换；抽屉宽度扩展到 `max-w-4xl`。
   - 验证：`npm run build` 通过；`scripts/smoke-test.js` 全章节渲染无错误。

6. **谜题类型多样化（步骤 8）**：
   - 新增三种谜题组件并接入 `PuzzleRenderer`：
     - `CipherDial.tsx`：双圈凯撒密码盘，可转动内圈实时解码。
     - `JigsawPuzzle.tsx`：图片拼图，点击两块碎片交换位置。
     - `HiddenObject.tsx`：在场景中点击寻找隐藏目标。
   - 新增谜题配置：`p_hidden_floorplan`（平面图找地点）、`p_jigsaw_news`（拼回报纸）、`p_cipher_dial`（密码盘）。
   - 流程接入：
     - 第 1 章《新闻》改为复合谜题 `p_news_compound`：先拼图再看报答题。
     - 第 3 章《卷宗袋》复合谜题加入 `p_hidden_floorplan`：先找地点再解密照片与 IC 卡。
     - 第 4 章《来信与明信片》改为复合谜题 `p_letter_compound`：摩尔斯电码 + 密码盘。
   - 验证：`npm run build` 通过；`scripts/smoke-test.js` 全章节渲染无错误。

7. **章节专属氛围（步骤 9）**：
   - `src/hooks/useAudio.ts` 新增 `setMood(chapterId)`：根据章节调整背景音乐 BPM 与持续低频嗡鸣音高，推理紧张章节（timeline/deduction）加快 BPM，结局放慢。
   - `src/components/AmbientBackground.tsx` 调整各章节背景光晕配色，使不同章节色调更具辨识度。
   - `App.tsx` 在章节切换时调用 `setMood`，实现氛围随章节平滑过渡。
   - 验证：`npm run build` 通过；`scripts/smoke-test.js` 全章节渲染无错误。

8. **答错反馈增强（步骤 10）**：
   - 新增 `src/components/WrongFeedback.tsx`：答错时显示带剧情提醒的状态反馈（如“叶臻感到一阵头痛……”“换个角度再读一遍”）。
   - `gameStore.ts` 新增 `wrongAttempts` 计数与 `recordWrongAttempt()` 动作，累计错误次数触发不同文案。
   - 答错时新增心跳音效 `playHeartbeat`，并在 QuizPuzzle、ConnectPuzzle、TimelinePuzzle、CipherDial、AccusationPuzzle 中统一接入。
   - 错误输入/选项增加抖动动画，指认真凶错误会先弹出反馈再进入坏结局。
   - 验证：`npm run build` 通过；`scripts/smoke-test.js` 全章节渲染无错误。

9. **批量去除图片水印（新增）**：
   - 新增 `scripts/remove-watermark.py`：使用 OpenCV 模板匹配检测右下角“夸克扫描王”水印，支持多尺度。
   - 处理策略：
     - 水印位于纯白页边时，直接裁剪底部页边，保留全部内容。
     - 水印覆盖在画面上时，取水印左侧同高度背景平均色填充并羽化边缘，避免水印文字/二维码残留。
   - 已处理 93 张图片，47 张无水印跳过；原始文件完整备份到 `public/assets/images-original/`。
   - 验证：`npm run build` 通过；`scripts/smoke-test.js` 全章节渲染无错误、无 4xx/5xx。

- 下一步：完整通关验证已通过（无错误、无资源失败）。6–10 步 UI/UX 优化与图片去水印均已完成。后续重点：继续打磨游戏体验——让游戏更好玩、更有趣、互动更多、更像精品。可按主题/模块批量推进，在自然节点运行 `npm run build` 与 smoke test 做阶段性验证，并在 `HANDOFF.md` 记录里程碑。

## 项目目标

将单人剧本杀《仁馨精神病院》电子化为中文悬疑推理 Web 游戏。核心内容（完整剧情、核心诡计、图文证据、提示系统、官方双结局、动画音效与新手友好的交互）已基本完成。

当前阶段目标：**在保留核心内容与双结局的前提下，持续优化游戏体验，让游戏更好玩、更有趣、互动更多、更像精品。** 优先做聚焦的打磨（节奏、反馈、可探索性、氛围、小而美的交互），而非大规模重构或新增 speculative 系统。

## 技术栈与运行

- React 19 + TypeScript + Vite + Tailwind CSS
- Framer Motion：动画
- Zustand：游戏状态
- Tone.js：氛围音与模拟音频
- Playwright：流程验证

```bash
cd /Users/lantian/AI/gameone/game
npm install
npm run dev
npm run build
```

## 当前完成状态

- 7 个章节与完整通关流程已接入。
- 原始 PDF/图片已转为高清图并用于游戏。
- 官方双结局已实现，包含疼痛/止痛药判定与真凶指认。
- 线索本、四级提示、章节导航和氛围动画已实现。
- 核心推理节点已覆盖：
  - 病房照片解密与大脑组织
  - 明信片摩尔斯电码 `304 fridge brain`
  - 七名病人与病症连线
  - 电梯 IC 卡权限碎片与四楼权限取消
  - 案发前夜时间线排序
  - 真凶指认袁枝
- 第 2 章已有两个模拟音频播放器：警察局对话记录、崔哲金留言。
- 已有基础音效、扫描线、背景光晕、章节转场和紧张低音。

## 预计体验时长

- 完整阅读与推理：约 2–4 小时。
- 熟练玩家或频繁使用提示：约 1–1.5 小时。
- 阅读最密集的是第 3 章卷宗袋，约 40–70 分钟。

## 已知简化

1. 原素材没有真实录音文件或转录文本，当前音频播放器是明确标注的模拟播放。
2. IC 卡拼图采用自由拖放加观察题，没有强制每块碎片精确位置校验。
3. 病房照片的关键线索已覆盖，但其余隐藏信息主要供画廊自由查看，并非全部强制谜题。
4. 原会话提到部分原创场景插画是 SVG 风格化占位；发布前应检查是否需要替换为正式资产。

## 关键文件

- `src/App.tsx`：应用入口与总流程
- `src/data/chapters.ts`：章节内容
- `src/data/clues.ts`：线索
- `src/data/puzzles.ts`：谜题配置
- `src/data/truth.ts`：真相与结局资料
- `src/store/gameStore.ts`：游戏进度状态
- `src/components/ChapterView.tsx`：章节页面
- `src/components/ClueNotebook.tsx`：线索本
- `src/components/AudioPlayer.tsx`：模拟音频播放器
- `src/components/puzzles/`：各类谜题实现
- `public/materials/`：原始图文素材
- `HANDOFFTRANSCRIPT.md`：旧会话完整导出，仅在缺少具体历史细节时定向搜索

## 下一步建议

不要立即增加新功能。新会话先执行一次发布前审计：

1. 读取本文件和关键代码，不读取完整旧 transcript。
2. 运行 `npm run build`，修复构建错误。
3. 启动游戏并从序章到双结局走一遍，记录阻塞通关或明显影响理解的问题。
4. 只选择一个最高优先级问题修复并验证。
5. 更新本文件，写清修改内容、验证结果和下一个单一步骤。

## 用户偏好

- 使用中文沟通。
- 一步一步优化，不要一次展开过大的任务。
- 节省 API 与上下文额度。
- 优先保证完整通关和故事逻辑，再做美术、音频与细节润色。
- 不要删除或覆盖已完成内容，除非用户明确要求。
