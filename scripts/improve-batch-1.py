#!/usr/bin/env python3
"""
10件ずつ確実に更新するスクリプト
- エラーハンドリング強化
- 進捗表示
"""
import subprocess
import time
import sys

# 最初の10件のレシピと材料定義
BATCH_1 = [
    {
        'recipe_id': 'side_011',
        'title': '小松菜のおひたし',
        'ingredients': [
            ('ing_komatsuna', 200, 'g'),
            ('ing_soy_sauce', 15, 'ml'),
            ('ing_broth', 50, 'ml'),
            ('ing_bonito', 5, 'g')
        ]
    },
    {
        'recipe_id': 'side_012',
        'title': '白菜の浅漬け',
        'ingredients': [
            ('ing_chinese_cabbage', 300, 'g'),
            ('ing_salt', 10, 'g'),
            ('ing_kombu', 5, 'g'),
            ('ing_chili', 1, '本')
        ]
    },
    {
        'recipe_id': 'side_013',
        'title': 'きゅうりの酢の物',
        'ingredients': [
            ('ing_cucumber', 2, '本'),
            ('ing_vinegar', 30, 'ml'),
            ('ing_sugar', 15, 'g'),
            ('ing_salt', 3, 'g'),
            ('ing_sesame', 5, 'g')
        ]
    },
    {
        'recipe_id': 'side_014',
        'title': 'トマトサラダ',
        'ingredients': [
            ('ing_tomato', 3, '個'),
            ('ing_onion', 0.25, '個'),
            ('ing_olive_oil', 15, 'ml'),
            ('ing_vinegar', 10, 'ml'),
            ('ing_salt', 2, 'g')
        ]
    },
    {
        'recipe_id': 'side_015',
        'title': 'もやしのナムル',
        'ingredients': [
            ('ing_bean_sprouts', 200, 'g'),
            ('ing_sesame_oil', 10, 'ml'),
            ('ing_garlic', 1, '片'),
            ('ing_salt', 3, 'g'),
            ('ing_sesame', 5, 'g')
        ]
    },
    {
        'recipe_id': 'side_016',
        'title': 'ほうれん草のごま和え',
        'ingredients': [
            ('ing_spinach', 200, 'g'),
            ('ing_sesame', 20, 'g'),
            ('ing_soy_sauce', 15, 'ml'),
            ('ing_sugar', 10, 'g')
        ]
    },
    {
        'recipe_id': 'side_017',
        'title': 'ピーマンの肉詰め',
        'ingredients': [
            ('ing_bell_pepper', 4, '個'),
            ('ing_ground_pork', 200, 'g'),
            ('ing_onion', 0.5, '個'),
            ('ing_egg', 1, '個'),
            ('ing_breadcrumbs', 30, 'g')
        ]
    },
    {
        'recipe_id': 'side_018',
        'title': 'なすの煮浸し',
        'ingredients': [
            ('ing_eggplant', 3, '本'),
            ('ing_broth', 300, 'ml'),
            ('ing_soy_sauce', 30, 'ml'),
            ('ing_mirin', 30, 'ml'),
            ('ing_ginger', 1, '片')
        ]
    },
    {
        'recipe_id': 'side_019',
        'title': '大根サラダ',
        'ingredients': [
            ('ing_daikon', 200, 'g'),
            ('ing_carrot', 50, 'g'),
            ('ing_sesame', 5, 'g'),
            ('ing_soy_sauce', 15, 'ml'),
            ('ing_vinegar', 10, 'ml')
        ]
    },
    {
        'recipe_id': 'side_020',
        'title': 'かぼちゃサラダ',
        'ingredients': [
            ('ing_pumpkin', 300, 'g'),
            ('ing_mayonnaise', 40, 'g'),
            ('ing_raisins', 20, 'g'),
            ('ing_salt', 2, 'g')
        ]
    }
]

def run_sql(cmd):
    """SQLコマンドを実行"""
    result = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', '--command', cmd],
        capture_output=True,
        text=True,
        timeout=30,
        cwd='/home/user/webapp'
    )
    return '"success": true' in result.stdout, result.stdout, result.stderr

def update_recipe(recipe):
    """1件のレシピを更新"""
    recipe_id = recipe['recipe_id']
    title = recipe['title']
    ingredients = recipe['ingredients']
    
    print(f"  🔄 {recipe_id} - {title}", end=" ", flush=True)
    
    # Step 1: 既存材料を削除
    cmd1 = f"DELETE FROM recipe_ingredients WHERE recipe_id = '{recipe_id}';"
    success, stdout, stderr = run_sql(cmd1)
    if not success:
        print(f"❌ 材料削除失敗")
        return False
    
    time.sleep(0.5)
    
    # Step 2: 新しい材料を追加
    for ing_id, qty, unit in ingredients:
        cmd2 = f"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ('{recipe_id}', '{ing_id}', {qty}, '{unit}');"
        success, stdout, stderr = run_sql(cmd2)
        if not success:
            print(f"❌ 材料追加失敗 ({ing_id})")
            return False
        time.sleep(0.3)
    
    # Step 3: 説明を更新
    description = f'{title}を家庭で簡単に作れるレシピ。栄養バランスも考慮しています。'
    cmd3 = f"UPDATE recipes SET description = '{description}', updated_at = datetime('now') WHERE recipe_id = '{recipe_id}';"
    success, stdout, stderr = run_sql(cmd3)
    if not success:
        print(f"❌ 説明更新失敗")
        return False
    
    print("✅")
    return True

def main():
    print("=" * 60)
    print("🚀 汎用データ改善（Batch 1: 10件）")
    print("=" * 60)
    print(f"対象: {BATCH_1[0]['recipe_id']} 〜 {BATCH_1[-1]['recipe_id']}")
    print("=" * 60)
    
    success_count = 0
    error_count = 0
    
    for i, recipe in enumerate(BATCH_1, 1):
        print(f"[{i}/10]", end=" ")
        if update_recipe(recipe):
            success_count += 1
        else:
            error_count += 1
    
    print("=" * 60)
    print(f"✅ 成功: {success_count}件")
    print(f"❌ 失敗: {error_count}件")
    print("=" * 60)
    
    if error_count == 0:
        print("🎉 Batch 1 完了！次のバッチに進めます。")
    else:
        print("⚠️  エラーが発生しました。ログを確認してください。")

if __name__ == '__main__':
    main()
