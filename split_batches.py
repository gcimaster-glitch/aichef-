#!/usr/bin/env python3
import os

# 既存の統合ファイルを50件ずつに分割
for batch_num in range(1, 6):
    input_file = f"/tmp/merged_batch_{batch_num:02d}.sql"
    if not os.path.exists(input_file):
        continue
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # VALUES行を抽出（2行目がINSERT文、3行目からがデータ）
    values_lines = []
    for line in lines[2:]:  # Skip first 2 lines (comment and INSERT statement)
        if line.strip() and not line.strip().startswith('--'):
            values_lines.append(line.strip().rstrip(',').rstrip(';'))
    
    # 50件ずつに分割
    chunk_size = 50
    for i in range(0, len(values_lines), chunk_size):
        chunk = values_lines[i:i+chunk_size]
        output_file = f"/tmp/split_batch_{batch_num:02d}_{(i//chunk_size)+1:02d}.sql"
        
        with open(output_file, 'w', encoding='utf-8') as out:
            out.write("-- Split batch file\n")
            out.write("INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES\n")
            out.write(",\n".join(chunk) + ";\n")
        
        print(f"✅ Created {output_file} with {len(chunk)} values")

print("\n✅ 分割完了！")
