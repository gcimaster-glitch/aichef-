#!/usr/bin/env python3
"""
126件の汎用データを完全改善するスクリプト
- 既存のタイトルから適切な材料を推測
- 外部キー制約対応で1件ずつ確実に更新
- エラーハンドリング
"""
import subprocess
import time
import json
import re

# タイトルから材料を推測する辞書
RECIPE_INGREDIENTS = {
    # 副菜（side_011〜side_090）
    'レタスサラダ': ['ing_lettuce:100:g', 'ing_tomato:1:個', 'ing_cucumber:1:本', 'ing_olive_oil:10:ml', 'ing_salt:2:g'],
    'きゅうりの酢の物': ['ing_cucumber:2:本', 'ing_vinegar:30:ml', 'ing_sugar:15:g', 'ing_salt:3:g', 'ing_sesame:5:g'],
    '小松菜のおひたし': ['ing_komatsuna:200:g', 'ing_soy_sauce:15:ml', 'ing_broth:50:ml', 'ing_bonito:5:g'],
    '白菜の浅漬け': ['ing_chinese_cabbage:300:g', 'ing_salt:10:g', 'ing_kombu:5:g', 'ing_chili:1:本'],
    'トマトサラダ': ['ing_tomato:3:個', 'ing_onion:0.25:個', 'ing_olive_oil:15:ml', 'ing_vinegar:10:ml', 'ing_salt:2:g'],
    'もやしのナムル': ['ing_bean_sprouts:200:g', 'ing_sesame_oil:10:ml', 'ing_garlic:1:片', 'ing_salt:3:g', 'ing_sesame:5:g'],
    'ほうれん草のごま和え': ['ing_spinach:200:g', 'ing_sesame:20:g', 'ing_soy_sauce:15:ml', 'ing_sugar:10:g'],
    'ピーマンの肉詰め': ['ing_bell_pepper:4:個', 'ing_ground_pork:200:g', 'ing_onion:0.5:個', 'ing_egg:1:個', 'ing_breadcrumbs:30:g'],
    'なすの煮浸し': ['ing_eggplant:3:本', 'ing_broth:300:ml', 'ing_soy_sauce:30:ml', 'ing_mirin:30:ml', 'ing_ginger:1:片'],
    '大根サラダ': ['ing_daikon:200:g', 'ing_carrot:50:g', 'ing_sesame:5:g', 'ing_soy_sauce:15:ml', 'ing_vinegar:10:ml'],
    'じゃがいものそぼろ煮': ['ing_potato:300:g', 'ing_ground_pork:150:g', 'ing_onion:0.5:個', 'ing_broth:200:ml', 'ing_soy_sauce:30:ml', 'ing_mirin:20:ml', 'ing_sugar:15:g'],
    'マカロニサラダ': ['ing_macaroni:100:g', 'ing_cucumber:1:本', 'ing_carrot:50:g', 'ing_ham:50:g', 'ing_mayonnaise:50:g', 'ing_salt:2:g'],
    '温泉卵': ['ing_egg:4:個'],
    'かぼちゃサラダ': ['ing_pumpkin:300:g', 'ing_mayonnaise:40:g', 'ing_raisins:20:g', 'ing_salt:2:g'],
    'ブロッコリーのおかか和え': ['ing_broccoli:1:株', 'ing_bonito:10:g', 'ing_soy_sauce:15:ml'],
    'アスパラベーコン': ['ing_asparagus:10:本', 'ing_bacon:100:g', 'ing_butter:10:g', 'ing_pepper:1:g'],
    'にんじんしりしり': ['ing_carrot:2:本', 'ing_egg:2:個', 'ing_tuna_can:1:缶', 'ing_soy_sauce:15:ml'],
    'きんぴらごぼう': ['ing_burdock:1:本', 'ing_carrot:0.5:本', 'ing_sesame_oil:10:ml', 'ing_soy_sauce:20:ml', 'ing_mirin:20:ml', 'ing_sugar:15:g'],
    
    # 汁物（soup_011〜soup_059）
    '味噌汁（豆腐・わかめ）': ['ing_tofu:150:g', 'ing_wakame:10:g', 'ing_broth:600:ml', 'ing_miso:40:g'],
    '味噌汁（大根・油揚げ）': ['ing_daikon:150:g', 'ing_fried_tofu:2:枚', 'ing_broth:600:ml', 'ing_miso:40:g'],
    '味噌汁（キャベツ・玉ねぎ）': ['ing_cabbage:150:g', 'ing_onion:0.5:個', 'ing_broth:600:ml', 'ing_miso:40:g'],
    '味噌汁（じゃがいも）': ['ing_potato:2:個', 'ing_broth:600:ml', 'ing_miso:40:g', 'ing_green_onion:1:本'],
    '味噌汁（ほうれん草・卵）': ['ing_spinach:100:g', 'ing_egg:1:個', 'ing_broth:600:ml', 'ing_miso:40:g'],
    '味噌汁（なめこ・豆腐）': ['ing_nameko:100:g', 'ing_tofu:150:g', 'ing_broth:600:ml', 'ing_miso:40:g'],
    '味噌汁（さつまいも）': ['ing_sweet_potato:150:g', 'ing_broth:600:ml', 'ing_miso:40:g', 'ing_green_onion:1:本'],
    '味噌汁（もやし）': ['ing_bean_sprouts:150:g', 'ing_broth:600:ml', 'ing_miso:40:g', 'ing_green_onion:1:本'],
    'コーンスープ': ['ing_corn:200:g', 'ing_milk:300:ml', 'ing_butter:10:g', 'ing_salt:3:g', 'ing_pepper:1:g'],
    'オニオンスープ': ['ing_onion:2:個', 'ing_broth:600:ml', 'ing_butter:20:g', 'ing_salt:3:g', 'ing_cheese:30:g'],
    'トマトスープ': ['ing_tomato:3:個', 'ing_onion:0.5:個', 'ing_broth:600:ml', 'ing_olive_oil:10:ml', 'ing_salt:3:g'],
    'かぼちゃスープ': ['ing_pumpkin:300:g', 'ing_milk:300:ml', 'ing_butter:10:g', 'ing_salt:3:g'],
    '卵スープ': ['ing_egg:2:個', 'ing_broth:600:ml', 'ing_green_onion:1:本', 'ing_salt:3:g', 'ing_soy_sauce:5:ml'],
}

def get_ingredients_from_title(title):
    """タイトルから材料リストを取得"""
    for key, ingredients in RECIPE_INGREDIENTS.items():
        if key in title:
            return ingredients
    # デフォルト（マッチしない場合）
    return ['ing_vegetables:150:g', 'ing_salt:2:g', 'ing_oil:10:ml']

def update_recipe(recipe_id, title):
    """レシピを完全更新"""
    ingredients = get_ingredients_from_title(title)
    
    # Step 1: 既存の材料を削除
    cmd1 = f"DELETE FROM recipe_ingredients WHERE recipe_id = '{recipe_id}';"
    result1 = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', '--command', cmd1],
        capture_output=True,
        text=True,
        timeout=30,
        cwd='/home/user/webapp'
    )
    
    if '"success": true' not in result1.stdout:
        return False
    
    time.sleep(0.5)
    
    # Step 2: 新しい材料を追加
    for ing in ingredients:
        parts = ing.split(':')
        ingredient_id = parts[0]
        quantity = parts[1]
        unit = parts[2]
        
        cmd2 = f"""
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        VALUES ('{recipe_id}', '{ingredient_id}', {quantity}, '{unit}');
        """
        
        result2 = subprocess.run(
            ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', '--command', cmd2],
            capture_output=True,
            text=True,
            timeout=30,
            cwd='/home/user/webapp'
        )
        
        if '"success": true' not in result2.stdout:
            return False
        
        time.sleep(0.3)
    
    # Step 3: レシピ説明を更新
    description = f'{title}を家庭で簡単に作れるレシピ。栄養バランスも考慮しています。'
    cmd3 = f"""
    UPDATE recipes SET
      description = '{description}',
      updated_at = datetime('now')
    WHERE recipe_id = '{recipe_id}';
    """
    
    result3 = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', '--command', cmd3],
        capture_output=True,
        text=True,
        timeout=30,
        cwd='/home/user/webapp'
    )
    
    return '"success": true' in result3.stdout

def main():
    print("🚀 126件の汎用データを完全改善")
    print("=" * 60)
    print("⚠️  材料を具体的に更新します（約15分かかります）")
    print("=" * 60)
    
    # 全レシピ取得
    cmd = """
    SELECT recipe_id, title FROM recipes
    WHERE (role = 'side' AND recipe_id >= 'side_011')
       OR (role = 'soup' AND recipe_id >= 'soup_011')
    ORDER BY recipe_id
    """
    
    result = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', '--command', cmd],
        capture_output=True,
        text=True,
        timeout=60,
        cwd='/home/user/webapp'
    )
    
    if '"success": true' not in result.stdout:
        print("❌ レシピ取得失敗")
        return
    
    # JSON解析
    json_match = re.search(r'\[\s*\{.*?\}\s*\]', result.stdout, re.DOTALL)
    if not json_match:
        print("❌ JSON解析失敗")
        return
    
    data = json.loads(json_match.group(0))
    recipes = data[0]['results'] if data and 'results' in data[0] else []
    
    print(f"✅ {len(recipes)}件取得\n")
    
    success_count = 0
    error_count = 0
    
    for i, recipe in enumerate(recipes, 1):
        recipe_id = recipe['recipe_id']
        title = recipe['title']
        
        print(f"[{i}/{len(recipes)}] {recipe_id} - {title}...", end=" ", flush=True)
        
        if update_recipe(recipe_id, title):
            print("✅")
            success_count += 1
        else:
            print("❌")
            error_count += 1
        
        if i % 10 == 0:
            print(f"  📊 進捗: {success_count}件成功、{error_count}件失敗\n")
    
    print("=" * 60)
    print(f"✅ 更新完了: {success_count}件")
    print(f"❌ エラー: {error_count}件")
    print("=" * 60)

if __name__ == '__main__':
    main()
