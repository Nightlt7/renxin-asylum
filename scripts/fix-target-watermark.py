#!/usr/bin/env python3
"""
针对仍带水印的图片进行补处理。
策略：检测底部白色页边带，直接裁剪掉水印所在的底部白边。
适用于病房照片、IC 卡碎片拼图纸等底部带白边的图片。
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

BRIGHT_THRESHOLD = 240
WHITE_FRAC_THRESHOLD = 0.85


def remove_bottom_watermark(path: Path) -> tuple[bool, str]:
    original = Image.open(path)
    img = cv2.imread(str(path))
    if img is None:
        return False, '无法读取'

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    # 从下往上扫描，找到白色页边结束、内容开始的那一行
    bright_frac = np.mean(gray > BRIGHT_THRESHOLD, axis=1)
    cut = None
    for r in range(h - 1, -1, -1):
        if bright_frac[r] < WHITE_FRAC_THRESHOLD:
            cut = r
            break

    if cut is None:
        return False, '未检测到可裁剪的底部白边'

    # 在内容开始处再留 2px 安全边距，避免裁到内容边缘
    new_h = min(max(0, cut + 2), h)
    if new_h >= h:
        return False, '无需裁剪'

    result = img[:new_h, :]
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

    return True, f'crop bottom {h - new_h}px'


def main():
    targets = [
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p1.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p2.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p3.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p4.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p5.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p6.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p6.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p7.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-陈旧的病房照片_p8.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-电梯ic卡记录碎片拼图纸_p1.png',
        '5-纵火案卷宗袋/5-纵火案卷子袋-电梯ic卡记录碎片拼图纸_p2.png',
    ]

    if not BACKUP_DIR.exists():
        print(f'备份目录不存在：{BACKUP_DIR}', file=sys.stderr)
        sys.exit(1)

    # 去重
    targets = list(dict.fromkeys(targets))

    for rel in targets:
        src = SOURCE_DIR / rel
        bak = BACKUP_DIR / rel
        if not bak.exists():
            print(f'[跳过] 备份不存在：{rel}')
            continue
        src.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(bak, src)
        ok, info = remove_bottom_watermark(src)
        if ok:
            print(f'[已处理] {rel} -> {info}')
        else:
            print(f'[失败]   {rel} ({info})')


if __name__ == '__main__':
    main()
