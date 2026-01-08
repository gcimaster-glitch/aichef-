#!/usr/bin/env python3
import os
import re

# 出力ファイル
output_files = []
current_values = []
current_file_index = 1
max_values_per_file = 300  # 1ファイルあたり300行

print("📦 バッチファイルを統合中...")

for i in range(1, 16):
    batch_file = f"migrations/generated/recipe_ingredients_batch_{i:03d}.sql"
    if not os.path.exists(batch_file):
        continue
    
    print(f"  - Processing {batch_file}...")
    
    with open(batch_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # VALUES句を抽出（各行が ('recipe_id', 'ingredient_id', quantity, 'unit'); の形式）
    # INSERTステートメントとVALUES句を分離
    lines = content.split('\n')
    for line in lines:
        # ('xxx', 'yyy', 123, 'unit'); の形式を探す
        match = re.match(r"\s*\('([^']+)',\s*'([^']+)',\s*([0-9.]+),\s*'([^']+)'\);", line)
        if match:
            current_values.append(f"('{match.group(1)}', '{match.group(2)}', {match.group(3)}, '{match.group(4)}')")
            
            # 300件ごとにファイルを分割
            if len(current_values) >= max_values_per_file:
                output_file = f"/tmp/merged_batch_{current_file_index:02d}.sql"
                with open(output_file, 'w', encoding='utf-8') as out:
                    out.write("-- Merged recipe ingredients batch\n")
                    out.write("INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES\n")
                    out.write(",\n".join(current_values) + ";\n")
                output_files.append(output_file)
                print(f"    ✅ Created {output_file} with {len(current_values)} values")
                current_values = []
                current_file_index += 1

# 残りのデータを書き出し
if current_values:
    output_file = f"/tmp/merged_batch_{current_file_index:02d}.sql"
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("-- Merged recipe ingredients batch\n")
        out.write("INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES\n")
        out.write(",\n".join(current_values) + ";\n")
    output_files.append(output_file)
    print(f"    ✅ Created {output_file} with {len(current_values)} values")

print(f"\n✅ 統合完了！{len(output_files)} 個のファイルを作成しました")
print(f"📝 ファイル一覧: {', '.join(output_files)}")
