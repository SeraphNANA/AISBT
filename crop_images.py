#!/usr/bin/env python3
"""
重新裁剪小龙虾图片，去除底部标签文字
"""

from PIL import Image
import os

INPUT_DIR = '/Users/ml25qs01/Trae-SOLO/Solo-mobile/AISBT/public/images/characters'
OUTPUT_DIR = '/Users/ml25qs01/Trae-SOLO/Solo-mobile/AISBT/public/images/characters'

def crop_images():
    for filename in sorted(os.listdir(INPUT_DIR)):
        if not filename.endswith('.png'):
            continue
            
        filepath = os.path.join(INPUT_DIR, filename)
        img = Image.open(filepath)
        width, height = img.size
        
        # 去除底部10%的高度（标签区域）
        crop_height = int(height * 0.9)
        
        # 居中裁剪，保持正方形
        left = (width - crop_height) // 2
        upper = 0
        right = left + crop_height
        lower = crop_height
        
        cropped = img.crop((left, upper, right, lower))
        
        # 保存（覆盖原文件）
        cropped.save(filepath, 'PNG')
        print(f"已处理: {filename} ({width}x{height} -> {crop_height}x{crop_height})")

if __name__ == '__main__':
    crop_images()
    print("\n✅ 全部图片处理完成！")
