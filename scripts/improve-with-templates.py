#!/usr/bin/env python3
"""
テンプレートベースで汎用データ126件を即改善
- タイトルから材料を推測
- 事前定義テンプレート使用
- コスト$0、時間5分
"""
import subprocess
import json
import re

# レシピテンプレート（タイトルベース）
RECIPE_TEMPLATES = {
    # 副菜テンプレート
    'きんぴら': {
        'base_ingredients': [
            {'id': 'ing_gobo', 'name': 'ごぼう', 'quantity': 150, 'unit': 'g'},
            {'id': 'ing_carrot', 'name': 'にんじん', 'quantity': 50, 'unit': 'g'},
            {'id': 'ing_soy_sauce', 'name': '醤油', 'quantity': 15, 'unit': 'ml'},
            {'id': 'ing_mirin', 'name': 'みりん', 'quantity': 15, 'unit': 'ml'},
            {'id': 'ing_sesame_oil', 'name': 'ごま油', 'quantity': 10, 'unit': 'ml'},
            {'id': 'ing_sesame', 'name': '白ごま', 'quantity': 5, 'unit': 'g'}
        ],
        'steps': [
            'ごぼうは細切りにして水にさらし、にんじんも細切りにする。',
            'フライパンにごま油を熱し、ごぼうとにんじんを中火で炒める。',
            '醤油、みりん、砂糖を加えて汁気がなくなるまで炒める。',
            '白ごまを振りかけて完成。'
        ],
        'time_min': 15,
        'difficulty': 'easy',
        'cost_tier': 500
    },
    'そぼろ煮': {
        'base_ingredients': [
            {'id': 'ing_potato', 'name': 'じゃがいも', 'quantity': 300, 'unit': 'g'},
            {'id': 'ing_ground_pork', 'name': '豚ひき肉', 'quantity': 150, 'unit': 'g'},
            {'id': 'ing_onion', 'name': '玉ねぎ', 'quantity': 0.5, 'unit': '個'},
            {'id': 'ing_broth', 'name': 'だし', 'quantity': 200, 'unit': 'ml'},
            {'id': 'ing_soy_sauce', 'name': '醤油', 'quantity': 30, 'unit': 'ml'},
            {'id': 'ing_mirin', 'name': 'みりん', 'quantity': 20, 'unit': 'ml'},
            {'id': 'ing_sugar', 'name': '砂糖', 'quantity': 15, 'unit': 'g'}
        ],
        'steps': [
            'じゃがいもは一口大に切り、玉ねぎはみじん切りにする。',
            '鍋に油を熱し、豚ひき肉と玉ねぎを炒める。',
            'じゃがいもとだしを加え、落し蓋をして15分煮る。',
            '醤油、みりん、砂糖を加え、さらに5分煮込む。'
        ],
        'time_min': 25,
        'difficulty': 'easy',
        'cost_tier': 800
    },
    'サラダ': {
        'base_ingredients': [
            {'id': 'ing_lettuce', 'name': 'レタス', 'quantity': 100, 'unit': 'g'},
            {'id': 'ing_cucumber', 'name': 'きゅうり', 'quantity': 1, 'unit': '本'},
            {'id': 'ing_tomato', 'name': 'トマト', 'quantity': 1, 'unit': '個'},
            {'id': 'ing_onion', 'name': '玉ねぎ', 'quantity': 0.25, 'unit': '個'},
            {'id': 'ing_dressing', 'name': 'ドレッシング', 'quantity': 30, 'unit': 'ml'}
        ],
        'steps': [
            'レタスは一口大にちぎり、冷水にさらす。',
            'きゅうりは薄切り、トマトはくし切り、玉ねぎは薄切りにする。',
            '野菜の水気を切り、器に盛る。',
            'ドレッシングをかけて完成。'
        ],
        'time_min': 10,
        'difficulty': 'easy',
        'cost_tier': 500
    },
    '煮物': {
        'base_ingredients': [
            {'id': 'ing_daikon', 'name': '大根', 'quantity': 300, 'unit': 'g'},
            {'id': 'ing_carrot', 'name': 'にんじん', 'quantity': 100, 'unit': 'g'},
            {'id': 'ing_broth', 'name': 'だし', 'quantity': 300, 'unit': 'ml'},
            {'id': 'ing_soy_sauce', 'name': '醤油', 'quantity': 30, 'unit': 'ml'},
            {'id': 'ing_mirin', 'name': 'みりん', 'quantity': 30, 'unit': 'ml'},
            {'id': 'ing_sugar', 'name': '砂糖', 'quantity': 15, 'unit': 'g'}
        ],
        'steps': [
            '大根は2cm厚さの半月切り、にんじんは乱切りにする。',
            '鍋にだし、醤油、みりん、砂糖を入れて煮立てる。',
            '大根とにんじんを加え、落し蓋をして20分煮る。',
            '野菜が柔らかくなったら完成。'
        ],
        'time_min': 30,
        'difficulty': 'easy',
        'cost_tier': 500
    },
    '温泉卵': {
        'base_ingredients': [
            {'id': 'ing_egg', 'name': '卵', 'quantity': 4, 'unit': '個'}
        ],
        'steps': [
            '鍋に水を沸騰させ、火を止める。',
            '卵を静かに入れ、蓋をして15分置く。',
            '冷水に取り、殻を剥いて完成。'
        ],
        'time_min': 20,
        'difficulty': 'easy',
        'cost_tier': 300
    },
    'マカロニサラダ': {
        'base_ingredients': [
            {'id': 'ing_macaroni', 'name': 'マカロニ', 'quantity': 100, 'unit': 'g'},
            {'id': 'ing_cucumber', 'name': 'きゅうり', 'quantity': 1, 'unit': '本'},
            {'id': 'ing_carrot', 'name': 'にんじん', 'quantity': 50, 'unit': 'g'},
            {'id': 'ing_ham', 'name': 'ハム', 'quantity': 50, 'unit': 'g'},
            {'id': 'ing_mayonnaise', 'name': 'マヨネーズ', 'quantity': 50, 'unit': 'g'},
            {'id': 'ing_salt', 'name': '塩', 'quantity': 2, 'unit': 'g'},
            {'id': 'ing_pepper', 'name': 'こしょう', 'quantity': 1, 'unit': 'g'}
        ],
        'steps': [
            'マカロニを茹でて冷水で冷やす。',
            'きゅうりは薄切り、にんじんは細切り、ハムは短冊切りにする。',
            'ボウルに全ての材料を入れ、マヨネーズ、塩、こしょうで和える。',
            '冷蔵庫で30分冷やして完成。'
        ],
        'time_min': 15,
        'difficulty': 'easy',
        'cost_tier': 500
    },
    # 汁物テンプレート
    '味噌汁': {
        'base_ingredients': [
            {'id': 'ing_broth', 'name': 'だし', 'quantity': 600, 'unit': 'ml'},
            {'id': 'ing_miso', 'name': '味噌', 'quantity': 40, 'unit': 'g'},
            {'id': 'ing_tofu', 'name': '豆腐', 'quantity': 0.5, 'unit': '丁'},
            {'id': 'ing_wakame', 'name': 'わかめ', 'quantity': 10, 'unit': 'g'}
        ],
        'steps': [
            '鍋にだしを入れて中火にかける。',
            '豆腐は1cm角に切り、わかめは水で戻す。',
            'だしが温まったら豆腐とわかめを加える。',
            '沸騰直前で火を弱め、味噌を溶き入れて完成。'
        ],
        'time_min': 10,
        'difficulty': 'easy',
        'cost_tier': 300
    },
    'スープ': {
        'base_ingredients': [
            {'id': 'ing_water', 'name': '水', 'quantity': 600, 'unit': 'ml'},
            {'id': 'ing_consomme', 'name': 'コンソメ', 'quantity': 2, 'unit': '個'},
            {'id': 'ing_cabbage', 'name': 'キャベツ', 'quantity': 100, 'unit': 'g'},
            {'id': 'ing_onion', 'name': '玉ねぎ', 'quantity': 0.5, 'unit': '個'},
            {'id': 'ing_carrot', 'name': 'にんじん', 'quantity': 50, 'unit': 'g'},
            {'id': 'ing_salt', 'name': '塩', 'quantity': 2, 'unit': 'g'},
            {'id': 'ing_pepper', 'name': 'こしょう', 'quantity': 1, 'unit': 'g'}
        ],
        'steps': [
            'キャベツは一口大、玉ねぎは薄切り、にんじんは細切りにする。',
            '鍋に水とコンソメを入れて沸騰させる。',
            '野菜を加えて10分煮る。',
            '塩、こしょうで味を調えて完成。'
        ],
        'time_min': 15,
        'difficulty': 'easy',
        'cost_tier': 500
    }
}

def match_template(title):
    """タイトルからテンプレートを選択"""
    for keyword, template in RECIPE_TEMPLATES.items():
        if keyword in title:
            return template
    
    # デフォルトテンプレート
    if '味噌汁' in title or '汁' in title:
        return RECIPE_TEMPLATES['味噌汁']
    elif 'サラダ' in title:
        return RECIPE_TEMPLATES['サラダ']
    elif '煮物' in title or '煮' in title:
        return RECIPE_TEMPLATES['煮物']
    else:
        return RECIPE_TEMPLATES['サラダ']  # フォールバック

def generate_sql_for_recipe(recipe_id, title, template):
    """レシピ更新SQLを生成"""
    
    steps_json = json.dumps(template['steps'], ensure_ascii=False).replace("'", "''")
    
    sql = []
    
    # 1. レシピ更新
    sql.append(f"""
UPDATE recipes SET
  description = '{title}を家庭で簡単に作れるレシピ。',
  difficulty = '{template['difficulty']}',
  time_min = {template['time_min']},
  cost_tier = {template['cost_tier']},
  steps_json = '{steps_json}',
  child_friendly_score = 80,
  updated_at = datetime('now')
WHERE recipe_id = '{recipe_id}';
""")
    
    # 2. 既存材料削除
    sql.append(f"DELETE FROM recipe_ingredients WHERE recipe_id = '{recipe_id}';")
    
    # 3. 新しい材料挿入
    for ing in template['base_ingredients']:
        ing_id = ing['id']
        ing_name = ing['name']
        quantity = ing['quantity']
        unit = ing['unit']
        
        # 材料マスタに追加（存在しない場合）
        sql.append(f"""
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, unit)
VALUES ('{ing_id}', '{ing_name}', 'other', '{unit}');
""")
        
        # レシピ材料関連追加
        sql.append(f"""
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('{recipe_id}', '{ing_id}', {quantity}, '{unit}');
""")
    
    return '\n'.join(sql)

def get_generic_recipes():
    """汎用データレシピを取得"""
    cmd = """
    SELECT 
      r.recipe_id,
      r.title,
      r.role
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
        # Parse JSON
        try:
            json_start = result.stdout.find('[')
            json_end = result.stdout.rfind(']') + 1
            data = json.loads(result.stdout[json_start:json_end])
            if data and 'results' in data[0]:
                return data[0]['results']
        except:
            pass
    
    return []

def main():
    print("🚀 テンプレートベースで126件改善開始！")
    print("=" * 60)
    
    # 既存レシピ取得
    print("\n📋 汎用データレシピ取得中...")
    recipes = get_generic_recipes()
    
    if not recipes:
        print("❌ レシピ取得失敗")
        return
    
    print(f"✅ {len(recipes)}件取得")
    
    # SQL生成
    all_sql = []
    
    for i, recipe in enumerate(recipes, 1):
        recipe_id = recipe['recipe_id']
        title = recipe['title']
        role = recipe['role']
        
        # テンプレート選択
        template = match_template(title)
        
        # SQL生成
        sql = generate_sql_for_recipe(recipe_id, title, template)
        all_sql.append(sql)
        
        print(f"[{i}/{len(recipes)}] ✅ {recipe_id} - {title} → {len(template['base_ingredients'])}種類の材料")
        
        # 進捗報告（20件ごと）
        if i % 20 == 0:
            print(f"  📊 進捗: {i}/{len(recipes)}件完了")
    
    print("\n" + "=" * 60)
    print(f"✅ SQL生成完了: {len(recipes)}件")
    
    # SQL保存
    output_path = '/tmp/improve_126_templates.sql'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(all_sql))
    
    print(f"\n💾 SQL保存完了: {output_path}")
    print(f"📊 SQL行数: {len('\\n'.join(all_sql).split('\\n'))}行")
    
    print("\n🎯 次のステップ:")
    print("  npx wrangler d1 execute aichef-production --remote --file=/tmp/improve_126_templates.sql")

if __name__ == '__main__':
    main()
