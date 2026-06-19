#!/usr/bin/env python3
"""
批量去除“夸克扫描王”水印。

处理流程：
1. 将 public/assets/images 备份到 public/assets/images-original。
2. 使用模板匹配定位右下角水印（支持多尺度）。
3. 若水印位于纯白/浅色页边：裁剪底部页边；否则使用 OpenCV 修复水印区域。
4. 覆盖保存处理后的图片，保留原始文件备份。
"""

import shutil
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = PROJECT_ROOT / 'public' / 'assets' / 'images'
BACKUP_DIR = PROJECT_ROOT / 'public' / 'assets' / 'images-original'
TEMPLATE_PATH = Path(__file__).resolve().parent / 'watermark_template.png'

# 匹配阈值：低于此值视为无水印
MATCH_THRESHOLD = 0.6
# 判定为“纯白页边”的均值/方差阈值
MARGIN_MEAN_THRESHOLD = 245
MARGIN_STD_THRESHOLD = 15

# 检测模板（小）与完整水印的相对关系
# 小模板从右下角裁剪 300x160，完整水印约 420x180
TEMPLATE_CROP_W = 300
TEMPLATE_CROP_H = 160
FULL_WM_W = 420
FULL_WM_H = 180
FULL_WM_OFFSET_X = 120  # 完整水印在小模板左侧
FULL_WM_OFFSET_Y = 20   # 完整水印在小模板上方


def load_template():
    if not TEMPLATE_PATH.exists():
        # 从已知带水印图片自动生成模板
        sample = SOURCE_DIR / '5-纵火案卷宗袋' / '5-纵火案卷子袋-警方调查记录簿_p1.png'
        if not sample.exists():
            raise FileNotFoundError(f'缺少水印模板，且找不到样本图：{sample}')
        im = Image.open(sample)
        w, h = im.size
        crop = im.crop((w - TEMPLATE_CROP_W, h - TEMPLATE_CROP_H, w, h))
        crop.save(TEMPLATE_PATH)
        print(f'已自动生成水印模板：{TEMPLATE_PATH}')
    tpl = cv2.imread(str(TEMPLATE_PATH), cv2.IMREAD_GRAYSCALE)
    if tpl is None:
        raise FileNotFoundError(f'无法读取水印模板：{TEMPLATE_PATH}')
    return tpl


def detect_watermark(gray, template):
    th, tw = template.shape
    best = (0, None, None, 1.0)
    for scale in [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5]:
        new_w = int(tw * scale)
        new_h = int(th * scale)
        if new_w > gray.shape[1] or new_h > gray.shape[0]:
            continue
        tpl = cv2.resize(template, (new_w, new_h), interpolation=cv2.INTER_AREA)
        res = cv2.matchTemplate(gray, tpl, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(res)
        if max_val > best[0]:
            best = (max_val, max_loc, (new_w, new_h), scale)
    if best[0] >= MATCH_THRESHOLD:
        return best
    return None


def remove_watermark(path, template):
    original = Image.open(path)
    img = cv2.imread(str(path))
    if img is None:
        return False, '无法读取'

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    det = detect_watermark(gray, template)
    if det is None:
        return False, '未检测到水印'

    score, (x, y), (w, h), scale = det

    # 根据小模板位置推算完整水印区域
    full_x = int(x - FULL_WM_OFFSET_X * scale)
    full_y = int(y - FULL_WM_OFFSET_Y * scale)
    full_w = int(FULL_WM_W * scale)
    full_h = int(FULL_WM_H * scale)
    full_x = max(0, full_x)
    full_y = max(0, full_y)
    full_w = min(img.shape[1] - full_x, full_w)
    full_h = min(img.shape[0] - full_y, full_h)

    # 检查水印上方的背景：若是纯白页边则直接裁剪
    margin_h = min(40, full_y)
    if margin_h > 0:
        above = gray[full_y - margin_h:full_y, full_x:full_x + full_w]
        mean = float(above.mean())
        std = float(above.std())
    else:
        mean, std = 0, 0

    # 检查水印左侧的背景：若水印坐在纯白页边上，则直接裁剪底部页边
    left_w = min(200, full_x)
    if left_w > 0 and full_h > 0:
        left_region = gray[full_y:full_y + full_h, full_x - left_w:full_x]
        left_mean = float(left_region.mean())
        left_std = float(left_region.std())
    else:
        left_mean, left_std = 0, 0

    if left_mean > MARGIN_MEAN_THRESHOLD and left_std < MARGIN_STD_THRESHOLD:
        # 裁剪到底部水印上方 5px，保留内容并去掉空白页边
        new_h = max(0, full_y - 5)
        result = img[:new_h, :]
        method = 'crop'
    else:
        # 非白边（水印覆盖在画面上）：取水印左侧同高度区域的平均色填充，并做边缘羽化
        result = img.copy()
        left_w = min(200, full_x)
        if left_w > 0 and full_h > 0:
            left_color_region = img[full_y:full_y + full_h, full_x - left_w:full_x]
            fill_color = left_color_region.mean(axis=(0, 1)).astype(np.uint8)
        else:
            fill_color = np.array([128, 128, 128], dtype=np.uint8)

        result[full_y:full_y + full_h, full_x:full_x + full_w] = fill_color

        # 边缘羽化
        feather_h = min(20, full_h)
        if feather_h > 0:
            for row in range(feather_h):
                alpha = row / feather_h
                result[full_y + row, full_x:full_x + full_w] = (
                    (1 - alpha) * fill_color + alpha * img[full_y + row, full_x:full_x + full_w]
                ).astype(np.uint8)

        method = 'fill'

    # 保存：尽量保留原格式与质量
    result_rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
    out = Image.fromarray(result_rgb)
    if original.mode == 'RGBA':
        out = out.convert('RGBA')

    suffix = path.suffix.lower()
    if suffix in ('.jpg', '.jpeg'):
        out = out.convert('RGB')
        out.save(path, quality=95, optimize=True)
    elif suffix == '.png':
        out.save(path, optimize=True)
    else:
        out.save(path)

    return True, f'{method} score={score:.2f} scale={scale}'


def main():
    if not SOURCE_DIR.exists():
        print(f'源目录不存在：{SOURCE_DIR}', file=sys.stderr)
        sys.exit(1)

    template = load_template()

    if not BACKUP_DIR.exists():
        print(f'创建备份：{BACKUP_DIR}')
        shutil.copytree(SOURCE_DIR, BACKUP_DIR)
    else:
        print(f'备份已存在：{BACKUP_DIR}')

    files = sorted(SOURCE_DIR.rglob('*'))
    images = [f for f in files if f.suffix.lower() in ('.png', '.jpg', '.jpeg')]

    processed = 0
    skipped = 0
    for path in images:
        rel = path.relative_to(SOURCE_DIR)
        ok, info = remove_watermark(path, template)
        if ok:
            print(f'[已处理] {rel} -> {info}')
            processed += 1
        else:
            print(f'[跳过]   {rel} ({info})')
            skipped += 1

    print(f'\n完成：处理 {processed} 张，跳过 {skipped} 张，备份 {BACKUP_DIR}')


if __name__ == '__main__':
    main()
