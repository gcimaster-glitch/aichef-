#!/usr/bin/env python3

# 失敗したretry_batchをさらに小さく分割
failed_files = [
    'retry_batch_01_01.sql',
    'retry_batch_02_02.sql', 
    'retry_batch_04_01.sql',
    'retry_batch_11_01.sql',
    'retry_batch_12_02.sql',
    'retry_batch_13_02.sql',
    'retry_batch_14_02.sql',
    'retry_batch_15_01.sql'
]

file_count = 0

for filename in failed_files:
    input_file = f"/tmp/{filename}"
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # VALUES行を抽出
    values_lines = []
    for line in lines[2:]:
        if line.strip() and not line.strip().startswith('--'):
            values_lines.append(line.strip().rstrip(',').rstrip(';'))
    
    # 10件ずつに分割
    chunk_size = 10
    for i in range(0, len(values_lines), chunk_size):
        chunk = values_lines[i:i+chunk_size]
        file_count += 1
        output_file = f"/tmp/final_batch_{file_count:02d}.sql"
        
        with open(output_file, 'w', encoding='utf-8') as out:
            out.write("-- Final batch (tiny)\n")
            out.write("INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES\n")
            out.write(",\n".join(chunk) + ";\n")
        
        print(f"✅ Created {output_file} with {len(chunk)} values")

print(f"\n✅ {file_count}個のファイルに分割完了！")
