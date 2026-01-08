#!/usr/bin/env python3
import os

# 投入済みレシピIDを読み込み
with open('/tmp/imported_recipe_ids.txt', 'r') as f:
    imported_ids = set(line.strip() for line in f if line.strip())

print(f"📋 投入済みレシピID: {len(imported_ids)}件")

# ローカルDBから全レシピ材料データを抽出
all_data = []
for i in range(1, 16):
    batch_file = f"migrations/generated/recipe_ingredients_batch_{i:03d}.sql"
    if not os.path.exists(batch_file):
        continue
    
    with open(batch_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for line in lines:
        # ('recipe_id', 'ingredient_id', quantity, 'unit'); の形式を探す
        if line.strip().startswith("('"):
            # recipe_idを抽出
            try:
                recipe_id = line.split("'")[1]
                if recipe_id not in imported_ids:
                    # カンマとセミコロンを削除
                    clean_line = line.strip().rstrip(',').rstrip(';')
                    all_data.append(clean_line)
            except:
                pass

print(f"📦 未投入データ: {len(all_data)}件")

# 50件ずつに分割して新しいバッチファイルを作成
chunk_size = 50
file_count = 0

for i in range(0, len(all_data), chunk_size):
    chunk = all_data[i:i+chunk_size]
    file_count += 1
    output_file = f"/tmp/remaining_batch_{file_count:02d}.sql"
    
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("-- Remaining recipe ingredients batch\n")
        out.write("INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES\n")
        out.write(",\n".join(chunk) + ";\n")
    
    print(f"  ✅ Created {output_file} with {len(chunk)} values")

print(f"\n✅ 未投入データを {file_count} 個のファイルに分割しました")
