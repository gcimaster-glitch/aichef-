#!/usr/bin/env python3
"""
残りのレシピに基本的な食材データを自動生成
"""
import csv

# 基本的な食材セット（primary_proteinとroleに応じて）
INGREDIENT_TEMPLATES = {
    # 主菜（肉系）
    'main_beef': [
        ('meat_beef', '300', 'g', False),
        ('veg_onion', '1', '個', False),
        ('veg_carrot', '1/2', '本', False),
        ('seasoning_salt', '少々', '適量', False),
        ('seasoning_pepper', '少々', '適量', False),
        ('oil_vegetable', '大さじ1', '大さじ', False),
    ],
    'main_pork': [
        ('meat_pork', '300', 'g', False),
        ('veg_onion', '1', '個', False),
        ('seasoning_salt', '少々', '適量', False),
        ('seasoning_soy_sauce', '大さじ1', '大さじ', False),
        ('oil_vegetable', '大さじ1', '大さじ', False),
    ],
    'main_chicken': [
        ('meat_chicken', '300', 'g', False),
        ('veg_onion', '1', '個', False),
        ('seasoning_salt', '少々', '適量', False),
        ('seasoning_soy_sauce', '大さじ1', '大さじ', False),
        ('oil_vegetable', '大さじ1', '大さじ', False),
    ],
    'main_fish': [
        ('fish_white', '4', '切れ', False),
        ('seasoning_salt', '少々', '適量', False),
        ('seasoning_soy_sauce', '大さじ1', '大さじ', False),
        ('oil_vegetable', '大さじ1', '大さじ', False),
    ],
    'main_egg': [
        ('ing_egg', '4', '個', False),
        ('veg_onion', '1', '個', False),
        ('seasoning_salt', '少々', '適量', False),
        ('oil_vegetable', '大さじ1', '大さじ', False),
    ],
    'main_other': [
        ('veg_onion', '1', '個', False),
        ('seasoning_salt', '少々', '適量', False),
        ('seasoning_soy_sauce', '大さじ1', '大さじ', False),
        ('oil_vegetable', '大さじ1', '大さじ', False),
    ],
    
    # 副菜
    'side': [
        ('veg_cabbage', '100', 'g', False),
        ('veg_carrot', '1/2', '本', False),
        ('seasoning_salt', '少々', '適量', False),
        ('seasoning_soy_sauce', '大さじ1', '大さじ', False),
    ],
    
    # 汁物
    'soup': [
        ('tofu_silken', '1', '丁', False),
        ('veg_green_onion', '1', '本', False),
        ('seasoning_miso', '大さじ2', '大さじ', False),
        ('dashi_powder', '小さじ1', '小さじ', False),
        ('water', '800', 'ml', False),
    ],
}

def get_template_key(role, primary_protein):
    """roleとprimary_proteinからテンプレートキーを取得"""
    if role == 'soup':
        return 'soup'
    elif role == 'side':
        return 'side'
    elif role == 'main':
        if primary_protein in ['beef', 'pork', 'chicken', 'fish', 'egg']:
            return f'main_{primary_protein}'
        else:
            return 'main_other'
    return 'main_other'

def main():
    with open('/home/user/webapp/remaining_recipes.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        recipes = list(reader)
    
    sql_statements = []
    
    for recipe in recipes:
        recipe_id, title, primary_protein, role = recipe
        
        template_key = get_template_key(role, primary_protein)
        ingredients = INGREDIENT_TEMPLATES.get(template_key, INGREDIENT_TEMPLATES['main_other'])
        
        for ing_id, quantity, unit, is_optional in ingredients:
            is_optional_val = 1 if is_optional else 0
            sql = f"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('{recipe_id}', '{ing_id}', '{quantity}', '{unit}', {is_optional_val});"
            sql_statements.append(sql)
    
    # SQL出力
    print("-- ========================================")
    print("-- 残り170件のレシピの基本食材データ")
    print("-- ========================================\n")
    
    for sql in sql_statements:
        print(sql)
    
    print(f"\n-- 合計 {len(sql_statements)} 件の食材データを生成しました")

if __name__ == '__main__':
    main()
