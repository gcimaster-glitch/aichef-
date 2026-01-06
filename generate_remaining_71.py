#!/usr/bin/env python3
"""
実際に未投入の71レシピに食材データを生成
"""
import json

# 基本的な食材セット
INGREDIENT_TEMPLATES = {
    'main_beef': [
        ('meat_beef', '300', 'g'), ('veg_onion', '1', '個'),
        ('seasoning_salt', '少々', '適量'), ('seasoning_soy_sauce', '大さじ1', '大さじ'),
        ('oil_vegetable', '大さじ1', '大さじ'),
    ],
    'main_pork': [
        ('meat_pork', '300', 'g'), ('veg_onion', '1', '個'),
        ('seasoning_salt', '少々', '適量'), ('seasoning_soy_sauce', '大さじ1', '大さじ'),
        ('oil_vegetable', '大さじ1', '大さじ'),
    ],
    'main_chicken': [
        ('meat_chicken', '300', 'g'), ('veg_onion', '1', '個'),
        ('seasoning_salt', '少々', '適量'), ('seasoning_soy_sauce', '大さじ1', '大さじ'),
        ('oil_vegetable', '大さじ1', '大さじ'),
    ],
    'main_fish': [
        ('fish_white', '4', '切れ'), ('seasoning_salt', '少々', '適量'),
        ('seasoning_soy_sauce', '大さじ1', '大さじ'), ('oil_vegetable', '大さじ1', '大さじ'),
    ],
    'main_egg': [
        ('ing_egg', '4', '個'), ('veg_onion', '1', '個'),
        ('seasoning_salt', '少々', '適量'), ('oil_vegetable', '大さじ1', '大さじ'),
    ],
    'main_other': [
        ('veg_onion', '1', '個'), ('seasoning_salt', '少々', '適量'),
        ('seasoning_soy_sauce', '大さじ1', '大さじ'), ('oil_vegetable', '大さじ1', '大さじ'),
    ],
    'side': [
        ('veg_cabbage', '100', 'g'), ('veg_carrot', '1/2', '本'),
        ('seasoning_salt', '少々', '適量'), ('seasoning_soy_sauce', '大さじ1', '大さじ'),
    ],
    'soup': [
        ('tofu_silken', '1', '丁'), ('veg_green_onion', '1', '本'),
        ('seasoning_miso', '大さじ2', '大さじ'), ('dashi_powder', '小さじ1', '小さじ'),
        ('water', '800', 'ml'),
    ],
}

def get_template_key(role, primary_protein):
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
    with open('/home/user/webapp/remaining_recipes_actual.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        recipes = data[0]['results']
    
    print(f"-- ========================================")
    print(f"-- 実際に未投入の{len(recipes)}件のレシピの食材データ")
    print(f"-- ========================================\n")
    
    for recipe in recipes:
        recipe_id = recipe['recipe_id']
        title = recipe['title']
        primary_protein = recipe['primary_protein']
        role = recipe['role']
        
        template_key = get_template_key(role, primary_protein)
        ingredients = INGREDIENT_TEMPLATES.get(template_key, INGREDIENT_TEMPLATES['main_other'])
        
        print(f"-- {title} ({recipe_id})")
        for ing_id, quantity, unit in ingredients:
            print(f"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('{recipe_id}', '{ing_id}', '{quantity}', '{unit}', 0);")
        print()
    
    total = len(recipes) * len(INGREDIENT_TEMPLATES['main_other'])  # 概算
    print(f"-- 合計 約{total} 件の食材データを生成しました")

if __name__ == '__main__':
    main()
