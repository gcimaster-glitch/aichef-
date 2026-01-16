#!/usr/bin/env python3
"""
汎用データ126件を高品質レシピに改善
- OpenAI GPT-4使用
- 既存タイトル保持
- 材料と手順を具体化
"""
import os
import json
import time
import subprocess
from openai import OpenAI

# OpenAI設定
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# 監査基準
QUALITY_STANDARDS = """
【必須条件】
1. 材料：4〜12種類（具体的な食材名、汎用的な「野菜」「肉」は禁止）
2. 手順：3〜6ステップ（各ステップは具体的で実行可能）
3. 調理時間：10〜60分（妥当な時間設定）
4. コスト：300〜1500円（家庭で実現可能）

【禁止事項】
❌ 汎用材料（「野菜150g」「肉200g」など）
❌ 曖昧な手順（「適量」「お好みで」など）
"""

def get_existing_recipes():
    """既存の汎用データレシピを取得"""
    cmd = """
    SELECT 
      r.recipe_id,
      r.title,
      r.role,
      r.cuisine
    FROM recipes r
    WHERE 
      (r.role = 'side' AND r.recipe_id >= 'side_011' AND r.recipe_id <= 'side_090')
      OR (r.role = 'soup' AND r.recipe_id >= 'soup_011' AND r.recipe_id <= 'soup_059')
    ORDER BY r.recipe_id
    """
    
    result = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', f'--command={cmd}'],
        capture_output=True,
        text=True,
        timeout=60
    )
    
    if '"success": true' in result.stdout:
        # Parse JSON output
        import re
        json_match = re.search(r'\[\s*\{.*?\}\s*\]', result.stdout, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
            if data and 'results' in data[0]:
                return data[0]['results']
    
    return []

def generate_quality_recipe(recipe_id, title, role, cuisine):
    """GPT-4で高品質レシピを生成"""
    
    prompt = f"""
あなたは日本の家庭料理の専門家です。以下のレシピを高品質化してください。

【レシピ情報】
- ID: {recipe_id}
- タイトル: {title}
- カテゴリ: {'副菜' if role == 'side' else '汁物'}
- 料理ジャンル: {cuisine}

{QUALITY_STANDARDS}

【出力形式】JSON
{{
  "ingredients": [
    {{"name": "材料名", "quantity": 数量, "unit": "単位", "ingredient_id": "ing_材料名"}}
  ],
  "steps": ["手順1", "手順2", "手順3", "手順4"],
  "description": "簡潔な説明（30文字以内）",
  "difficulty": "easy",
  "time_min": 調理時間（分）,
  "cost_tier": 500,
  "child_friendly_score": 80
}}

必ず4〜12種類の具体的な材料と、3〜6ステップの詳細な手順を含めてください。
ingredient_idは"ing_"で始まる英数字のIDにしてください（例：ing_potato, ing_carrot）。
"""
    
    try:
        response = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {'role': 'system', 'content': 'あなたは料理レシピの専門家です。'},
                {'role': 'user', 'content': prompt}
            ],
            temperature=0.7,
            response_format={'type': 'json_object'}
        )
        
        recipe_data = json.loads(response.choices[0].message.content)
        return recipe_data
        
    except Exception as e:
        print(f"❌ エラー ({recipe_id}): {str(e)}")
        return None

def generate_update_sql(recipe_id, title, recipe_data):
    """UPDATE SQLを生成"""
    
    # レシピ本体の更新
    steps_json = json.dumps(recipe_data['steps'], ensure_ascii=False)
    description = recipe_data.get('description', title)
    difficulty = recipe_data.get('difficulty', 'easy')
    time_min = recipe_data.get('time_min', 20)
    cost_tier = recipe_data.get('cost_tier', 500)
    child_friendly_score = recipe_data.get('child_friendly_score', 80)
    
    sql = []
    
    # 1. レシピ更新
    sql.append(f"""
UPDATE recipes SET
  description = '{description}',
  difficulty = '{difficulty}',
  time_min = {time_min},
  cost_tier = {cost_tier},
  steps_json = '{steps_json}',
  child_friendly_score = {child_friendly_score},
  updated_at = datetime('now')
WHERE recipe_id = '{recipe_id}';
""")
    
    # 2. 既存材料削除
    sql.append(f"DELETE FROM recipe_ingredients WHERE recipe_id = '{recipe_id}';")
    
    # 3. 新しい材料挿入
    for ing in recipe_data['ingredients']:
        ing_id = ing.get('ingredient_id', f"ing_{ing['name']}")
        quantity = ing['quantity']
        unit = ing['unit']
        
        # 材料マスタに存在しない場合は追加
        sql.append(f"""
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, unit)
VALUES ('{ing_id}', '{ing['name']}', 'other', '{unit}');
""")
        
        # レシピ材料関連追加
        sql.append(f"""
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('{recipe_id}', '{ing_id}', {quantity}, '{unit}');
""")
    
    return '\n'.join(sql)

def main():
    print("🚀 汎用データ126件を高品質化開始！")
    print("=" * 60)
    
    # 既存レシピ取得
    print("\n📋 既存レシピ取得中...")
    recipes = get_existing_recipes()
    
    if not recipes:
        print("❌ レシピ取得失敗")
        return
    
    print(f"✅ {len(recipes)}件取得")
    
    # SQL生成
    all_sql = []
    success_count = 0
    error_count = 0
    
    for i, recipe in enumerate(recipes, 1):
        recipe_id = recipe['recipe_id']
        title = recipe['title']
        role = recipe['role']
        cuisine = recipe.get('cuisine', 'japanese')
        
        print(f"\n[{i}/{len(recipes)}] 生成中: {recipe_id} - {title}")
        
        # GPT-4でレシピ生成
        recipe_data = generate_quality_recipe(recipe_id, title, role, cuisine)
        
        if recipe_data:
            # SQL生成
            sql = generate_update_sql(recipe_id, title, recipe_data)
            all_sql.append(sql)
            
            print(f"  ✅ 成功 - 材料{len(recipe_data['ingredients'])}種類")
            success_count += 1
        else:
            print(f"  ❌ 失敗")
            error_count += 1
        
        # Rate limiting
        time.sleep(1)
        
        # 進捗報告（10件ごと）
        if i % 10 == 0:
            print(f"\n  📊 進捗: {success_count}件成功、{error_count}件失敗")
            print(f"  ⏱️  残り: {len(recipes) - i}件")
    
    print("\n" + "=" * 60)
    print(f"✅ 生成完了: {success_count}件成功")
    print(f"❌ エラー: {error_count}件")
    
    # SQL保存
    if all_sql:
        output_path = '/tmp/improve_126_recipes.sql'
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n\n'.join(all_sql))
        
        print(f"\n💾 SQL保存完了: {output_path}")
        print(f"📊 SQL行数: {len('\\n'.join(all_sql).split('\\n'))}行")
        
        # 確認プロンプト
        print("\n⚠️  次のステップ:")
        print("  1. SQLファイルを確認")
        print("  2. npx wrangler d1 execute aichef-production --remote --file=/tmp/improve_126_recipes.sql")
        print("  3. 本番環境に反映")
    else:
        print("\n❌ SQL生成失敗")

if __name__ == '__main__':
    if not os.getenv('OPENAI_API_KEY'):
        print("❌ OPENAI_API_KEY環境変数が設定されていません")
        exit(1)
    
    main()
