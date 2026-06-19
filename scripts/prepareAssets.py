#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把原始 PDF/图片素材转换为游戏 public/assets/images 目录下的图片。"""

import fitz
from pathlib import Path
from PIL import Image
import io

SRC = Path('/Users/lantian/Downloads/剧本杀/仁馨精神病院')
OUT = Path('/Users/lantian/AI/gameone/game/public/assets/images')
OUT.mkdir(parents=True, exist_ok=True)


def pdf_to_images(pdf_path: Path, out_dir: Path):
    doc = fitz.open(str(pdf_path))
    for i in range(doc.page_count):
        page = doc[i]
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes('png')))
        out_name = f"{pdf_path.stem}_p{i+1}.png"
        img.save(out_dir / out_name, 'PNG')


def main():
    files = sorted(p for p in SRC.rglob('*') if p.is_file() and p.suffix.lower() in ('.pdf', '.jpg', '.jpeg', '.png'))
    for p in files:
        if p.name == '.DS_Store':
            continue
        rel_dir = p.relative_to(SRC).parent
        out_dir = OUT / rel_dir
        out_dir.mkdir(parents=True, exist_ok=True)
        if p.suffix.lower() == '.pdf':
            pdf_to_images(p, out_dir)
            print(f'PDF -> images: {p.relative_to(SRC)}')
        else:
            # copy image as is
            import shutil
            dest = out_dir / p.name
            shutil.copy2(p, dest)
            print(f'copied: {p.relative_to(SRC)}')


if __name__ == '__main__':
    main()
