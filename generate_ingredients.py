#!/usr/bin/env python3
"""
AIを使用してレシピの食材データを自動生成するスクリプト
"""
import json
import sys
import time
from openai import OpenAI

# OpenAI API設定
client = OpenAI()

def load_json_file(filepath):
    """JSONファイルを読み込む"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        if isinstance(data, list) and len(data) > 0 and 'results' in data[0]:
            return data[0]['results']
        return data

def generate_ingredients_for_recipe(recipe, ingredients_master):
    """
    OpenAI APIを使用してレシピの食材データを生成
    
    Args:
        recipe: レシピ情報（recipe_id, title, description, role, primary_protein）
        ingredients_master: 食材マスターリスト
    
    Returns:
        list: 食材データのリスト [{ingredient_id, quantity, unit, is_optional}, ...]
    """
    
    # 食材マスターから食材名のリストを作成
    ingredient_names = [ing['name'] for ing in ingredients_master]
    ingredient_map = {ing['name']: ing for ing in ingredients_master}
    
    prompt = f"""
あなたは日本の家庭料理の専門家です。以下のレシピに必要な食材を、提供された食材マスターリストから選び、適切な数量と単位を設定してください。

# レシピ情報
- レシピID: {recipe['recipe_id']}
- 料理名: {recipe['title']}
- 説明: {recipe['description']}
- 役割: {recipe['role']} (main=主菜, side=副菜, soup=汁物)
- 主なタンパク質: {recipe['primary_protein']}

# 食材マスターリスト（この中から選択してください）
{', '.join(ingredient_names)}

# 指示
1. この料理に必要な食材を食材マスターリストから選択してください
2. 4人分の基準で数量を設定してください
3. 適切な単位を設定してください（g, ml, 個, 枚, 本, 片, 適量など）
4. 必須の食材と任意の食材を区別してください

# 出力形式（JSONのみ、説明不要）
{{
  "ingredients": [
    {{
      "name": "食材名（食材マスターリストと完全一致）",
      "quantity": "200",
      "unit": "g",
      "is_optional": false
    }}
  ]
}}

重要: 食材名は必ず食材マスターリストに存在するものを使用してください。
"""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは日本料理の食材データを正確に生成する専門家です。必ず有効なJSON形式で出力してください。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        
        # JSONブロックを抽出（```json ... ``` で囲まれている場合）
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].split('```')[0].strip()
        
        result = json.loads(content)
        
        # 食材名をingredient_idに変換
        ingredients_with_ids = []
        for ing in result.get('ingredients', []):
            ing_name = ing['name']
            if ing_name in ingredient_map:
                ingredients_with_ids.append({
                    'ingredient_id': ingredient_map[ing_name]['ingredient_id'],
                    'quantity': ing['quantity'],
                    'unit': ing['unit'],
                    'is_optional': ing.get('is_optional', False)
                })
            else:
                print(f"警告: 食材 '{ing_name}' がマスターリストに見つかりません（レシピID: {recipe['recipe_id']}）", file=sys.stderr)
        
        return ingredients_with_ids
        
    except Exception as e:
        print(f"エラー（レシピID: {recipe['recipe_id']}）: {e}", file=sys.stderr)
        return []

def main():
    print("🚀 食材データ自動生成を開始します...\n", file=sys.stderr)
    
    # データ読み込み
    print("📖 データを読み込んでいます...", file=sys.stderr)
    recipes = load_json_file('/home/user/webapp/missing_ingredients_recipes.json')
    ingredients_master = load_json_file('/home/user/webapp/ingredients_master.json')
    
    print(f"✅ レシピ数: {len(recipes)}", file=sys.stderr)
    print(f"✅ 食材マスター数: {len(ingredients_master)}\n", file=sys.stderr)
    
    # SQLインサート文を生成
    all_sql_statements = []
    
    for i, recipe in enumerate(recipes, 1):
        print(f"[{i}/{len(recipes)}] 処理中: {recipe['title']} ({recipe['recipe_id']})", file=sys.stderr)
        
        ingredients = generate_ingredients_for_recipe(recipe, ingredients_master)
        
        if ingredients:
            for ing in ingredients:
                sql = f"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('{recipe['recipe_id']}', '{ing['ingredient_id']}', '{ing['quantity']}', '{ing['unit']}', {1 if ing['is_optional'] else 0});"
                all_sql_statements.append(sql)
            
            print(f"  ✅ {len(ingredients)}個の食材を生成しました", file=sys.stderr)
        else:
            print(f"  ⚠️  食材を生成できませんでした", file=sys.stderr)
        
        # API制限を考慮して少し待機
        if i % 10 == 0:
            print(f"\n⏸️  10件処理完了。APIレート制限のため2秒待機します...\n", file=sys.stderr)
            time.sleep(2)
    
    # SQL出力
    print("\n📝 SQL文を出力しています...", file=sys.stderr)
    for sql in all_sql_statements:
        print(sql)
    
    print(f"\n✅ 完了！合計 {len(all_sql_statements)} 件のINSERT文を生成しました", file=sys.stderr)
    print(f"💾 SQLファイルに保存してください: python3 generate_ingredients.py > generated_ingredients.sql", file=sys.stderr)

if __name__ == '__main__':
    main()
