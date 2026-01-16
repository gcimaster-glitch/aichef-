#!/usr/bin/env python3
"""
汎用データ126件を1件ずつ削除
- 外部キー制約対応
- recipe_ingredients → recipes の順で削除
"""
import subprocess
import sys
import time

def delete_recipe(recipe_id):
    """レシピを削除（材料→レシピの順）"""
    # Step 1: 材料削除
    cmd1 = f"DELETE FROM recipe_ingredients WHERE recipe_id = '{recipe_id}'"
    result1 = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', f'--command={cmd1}'],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    if '"success": true' not in result1.stdout:
        return False, "材料削除失敗"
    
    # Step 2: レシピ削除
    cmd2 = f"DELETE FROM recipes WHERE recipe_id = '{recipe_id}'"
    result2 = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', f'--command={cmd2}'],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    if '"success": true' not in result2.stdout:
        return False, "レシピ削除失敗"
    
    return True, "成功"

def main():
    print("🗑️  汎用データ126件削除開始")
    print("=" * 60)
    
    # 副菜77件（side_011〜side_090）
    side_ids = [f"side_{str(i).zfill(3)}" for i in range(11, 91)]
    
    # 汁物49件（soup_011〜soup_059）
    soup_ids = [f"soup_{str(i).zfill(3)}" for i in range(11, 60)]
    
    all_ids = side_ids + soup_ids
    
    success_count = 0
    error_count = 0
    
    for i, recipe_id in enumerate(all_ids, 1):
        print(f"[{i}/{len(all_ids)}] 削除中: {recipe_id}...", end=" ", flush=True)
        
        try:
            success, msg = delete_recipe(recipe_id)
            if success:
                print("✅")
                success_count += 1
            else:
                print(f"❌ {msg}")
                error_count += 1
        except Exception as e:
            print(f"❌ エラー: {str(e)}")
            error_count += 1
        
        # Progress report every 10 items
        if i % 10 == 0:
            print(f"  進捗: {success_count}件成功、{error_count}件失敗")
            time.sleep(1)  # Rate limiting
        else:
            time.sleep(0.5)
    
    print("=" * 60)
    print(f"✅ 削除成功: {success_count}件")
    print(f"❌ 削除失敗: {error_count}件")
    print("=" * 60)
    
    # 最終確認
    print("\n📊 最終レシピ数確認中...")
    result = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote',
         '--command=SELECT role, COUNT(*) as count FROM recipes GROUP BY role ORDER BY role'],
        capture_output=True,
        text=True,
        timeout=30
    )
    
    if '"success": true' in result.stdout:
        # Extract results
        import json
        try:
            data = json.loads(result.stdout.split('[', 1)[1].rsplit(']', 1)[0] + ']')
            if data and 'results' in data[0]:
                print("\n現在のレシピ数:")
                for row in data[0]['results']:
                    print(f"  {row['role']}: {row['count']}件")
        except:
            print(result.stdout)

if __name__ == '__main__':
    main()
