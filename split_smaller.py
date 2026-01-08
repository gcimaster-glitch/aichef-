#!/usr/bin/env python3

# 失敗したバッチを25件ずつに分割
failed_batches = ['01', '02', '04', '11', '12', '13', '14', '15']

for batch_num in failed_batches:
    input_file = f"/tmp/remaining_batch_{batch_num}.sql"
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # VALUES行を抽出
    values_lines = []
    for line in lines[2:]:
        if line.strip() and not line.strip().startswith('--'):
            values_lines.append(line.strip().rstrip(',').rstrip(';'))
    
    # 25件ずつに分割
    chunk_size = 25
    for i in range(0, len(values_lines), chunk_size):
        chunk = values_lines[i:i+chunk_size]
        output_file = f"/tmp/retry_batch_{batch_num}_{(i//chunk_size)+1:02d}.sql"
        
        with open(output_file, 'w', encoding='utf-8') as out:
            out.write("-- Retry batch (smaller)\n")
            out.write("INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES\n")
            out.write(",\n".join(chunk) + ";\n")
        
        print(f"✅ Created {output_file} with {len(chunk)} values")

print("\n✅ 分割完了！")
