#!/usr/bin/env python3
"""
切割小龙虾九宫格图片脚本
将E人和I人的九宫格图片切割成18张单独的图片
"""

from PIL import Image
import os

# 源图片路径
E_IMAGE_PATH = '/Users/ml25qs01/Downloads/九宫格E人系列L1-L9小龙虾等级.png'
I_IMAGE_PATH = '/Users/ml25qs01/Downloads/九宫格I人系列L1-L9小龙虾等级.png'

# 输出目录
OUTPUT_DIR = '/Users/ml25qs01/Trae-SOLO/Solo-mobile/AISBT/public/images/characters'

# 确保输出目录存在
os.makedirs(OUTPUT_DIR, exist_ok=True)

def split_3x3_grid(image_path, prefix):
    """
    切割3x3九宫格图片
    prefix: 'L' + 等级，例如 L1
    """
    img = Image.open(image_path)
    width, height = img.size
    
    print(f"图片尺寸: {width}x{height}")
    
    # 计算每个格子的尺寸
    cell_width = width // 3
    cell_height = height // 3
    
    print(f"每个格子尺寸: {cell_width}x{cell_height}")
    
    # 切割顺序：第一行 L1-L3，第二行 L4-L6，第三行 L7-L9
    order = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    
    for idx in range(9):
        row = idx // 3
        col = idx % 3
        level = order[idx]
        
        # 计算边界
        left = col * cell_width
        upper = row * cell_height
        right = left + cell_width
        lower = upper + cell_height
        
        # 切割
        cropped = img.crop((left, upper, right, lower))
        
        # 保存
        output_filename = f'L{level}_{prefix}.png'
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        cropped.save(output_path, 'PNG')
        print(f"已保存: {output_filename}")
    
    print(f"\n{prefix}系列完成！")
    print("=" * 50)

def main():
    print("开始切割E人系列...")
    split_3x3_grid(E_IMAGE_PATH, 'E')
    
    print("\n开始切割I人系列...")
    split_3x3_grid(I_IMAGE_PATH, 'I')
    
    print("\n✅ 全部完成！图片已保存到:", OUTPUT_DIR)
    print(f"\n共生成 {len(os.listdir(OUTPUT_DIR))} 张图片")
    
    print("\n生成的文件列表:")
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if f.endswith('.png'):
            print(f"  - {f}")

if __name__ == '__main__':
    main()
