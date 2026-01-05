#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
レシピ600品自動生成スクリプト
主菜300品、副菜200品、汁物100品を生成
"""

import json
import random

# ========================================
# レシピ生成のベースデータ
# ========================================

# 主菜のバリエーション（和食・洋食・中華）
main_dishes_wa = [
    "鶏の照り焼き", "豚の生姜焼き", "鮭の塩焼き", "さばの味噌煮", "ブリの照り焼き",
    "鶏のから揚げ", "豚カツ", "アジの南蛮漬け", "イワシの蒲焼き", "鶏の竜田揚げ",
    "豚肉と野菜の炒め物", "鶏つくね", "牛肉のしぐれ煮", "豚バラ大根", "鶏もも肉のネギ塩焼き",
    "鮭のホイル焼き", "豚の角煮", "鶏手羽の甘辛煮", "イカの煮付け", "タラの煮付け",
    "豚肉のピカタ", "鶏むね肉の梅しそ焼き", "牛肉とごぼうの煮物", "鮭のちゃんちゃん焼き", "豚ロースの味噌焼き",
    "鶏肉と長ネギの塩炒め", "豚肉とキャベツの味噌炒め", "牛肉とピーマンの炒め物", "鶏のねぎま焼き", "豚肉のしゃぶしゃぶ風"
]

main_dishes_yo = [
    "ハンバーグ", "ビーフシチュー", "チキンソテー", "ポークソテー", "エビフライ",
    "鶏むね肉のピカタ", "豚肉のトマト煮", "ミートボール", "ロールキャベツ", "グラタン",
    "チキンカレー", "ビーフカレー", "ポークカレー", "シーフードカレー", "野菜カレー",
    "スパゲッティミートソース", "カルボナーラ", "ペペロンチーノ", "ナポリタン", "クリームパスタ",
    "チキンのトマト煮込み", "豚ロースのソテー", "白身魚のムニエル", "鮭のムニエル", "エビのガーリックソテー",
    "オムライス", "ドリア", "ピザトースト", "チキンライス", "ハヤシライス",
    "ビーフストロガノフ", "チキンフリカッセ", "ポークチャップ", "タンドリーチキン", "フィッシュアンドチップス"
]

main_dishes_chu = [
    "麻婆豆腐", "回鍋肉", "青椒肉絲", "八宝菜", "酢豚",
    "エビチリ", "エビマヨ", "油淋鶏", "棒々鶏", "麻婆茄子",
    "春巻き", "餃子", "焼売", "チャーハン", "天津飯",
    "中華丼", "鶏肉のカシューナッツ炒め", "豚肉とニラの炒め物", "牛肉のオイスター炒め", "海老と卵の炒め物",
    "担々麺風", "中華風唐揚げ", "豚バラ肉の中華煮", "鶏肉の甘酢あんかけ", "白身魚の甘酢あんかけ"
]

# 副菜のバリエーション
side_dishes = [
    "ほうれん草のおひたし", "小松菜の煮浸し", "もやしのナムル", "きゅうりの酢の物", "トマトサラダ",
    "ポテトサラダ", "マカロニサラダ", "かぼちゃサラダ", "ごぼうサラダ", "大根サラダ",
    "キャベツの浅漬け", "白菜の浅漬け", "きゅうりの浅漬け", "なすの煮浸し", "ピーマンのきんぴら",
    "人参のきんぴら", "ごぼうのきんぴら", "れんこんのきんぴら", "ブロッコリーのサラダ", "カリフラワーのサラダ",
    "アスパラのベーコン巻き", "いんげんの胡麻和え", "枝豆", "冷奴", "温奴",
    "卵焼き", "厚焼き卵", "茶碗蒸し", "だし巻き卵", "スクランブルエッグ",
    "ひじきの煮物", "切り干し大根", "きんぴらごぼう", "煮豆", "おからの煮物",
    "コールスローサラダ", "海藻サラダ", "春雨サラダ", "中華風サラダ", "豆腐サラダ"
]

# 汁物のバリエーション
soup_dishes = [
    "豚汁", "味噌汁（豆腐・わかめ）", "味噌汁（なす・油揚げ）", "味噌汁（キャベツ）", "味噌汁（じゃがいも・玉ねぎ）",
    "けんちん汁", "かき玉汁", "中華スープ", "わかめスープ", "卵スープ",
    "コーンスープ", "コンソメスープ", "ミネストローネ", "クラムチャウダー", "オニオンスープ",
    "トマトスープ", "野菜スープ", "キャベツスープ", "白菜スープ", "ほうれん草スープ",
    "味噌汁（大根・油揚げ）", "味噌汁（小松菜）", "味噌汁（もやし）", "味噌汁（しめじ）", "味噌汁（えのき）"
]

# ========================================
# レシピ生成関数
# ========================================

def generate_recipe_id(role, index):
    """レシピIDを生成"""
    if role == "main":
        return f"main_{index:04d}"
    elif role == "side":
        return f"side_{index:04d}"
    elif role == "soup":
        return f"soup_{index:04d}"
    return f"rcp_{index:04d}"

def generate_time(role):
    """調理時間を生成（分）"""
    if role == "main":
        return random.choice([15, 20, 25, 30, 35, 40, 45])
    elif role == "side":
        return random.choice([5, 10, 15, 20])
    elif role == "soup":
        return random.choice([10, 15, 20])
    return 30

def generate_child_friendly_score(title):
    """子供向けスコアを生成（0-100）"""
    # 特定のキーワードで判定
    child_friendly_keywords = ["カレー", "ハンバーグ", "から揚げ", "オムライス", "グラタン", "唐揚げ", "エビフライ"]
    child_unfriendly_keywords = ["ピリ辛", "激辛", "麻婆", "キムチ", "わさび"]
    
    if any(kw in title for kw in child_friendly_keywords):
        return random.randint(80, 100)
    elif any(kw in title for kw in child_unfriendly_keywords):
        return random.randint(20, 50)
    else:
        return random.randint(50, 80)

def get_cuisine(title, index):
    """料理の種類を判定"""
    japanese_keywords = ["焼き", "煮", "揚げ", "炒め", "照り", "味噌", "醤油", "塩", "だし", "豚汁"]
    western_keywords = ["ステーキ", "ハンバーグ", "グラタン", "カレー", "シチュー", "ソテー", "フライ", "ムニエル", "ピカタ", "スパゲッティ", "パスタ"]
    chinese_keywords = ["麻婆", "回鍋肉", "青椒肉絲", "八宝菜", "酢豚", "エビチリ", "エビマヨ", "油淋鶏", "棒々鶏", "中華"]
    
    if any(kw in title for kw in chinese_keywords):
        return "chinese"
    elif any(kw in title for kw in western_keywords):
        return "western"
    elif any(kw in title for kw in japanese_keywords):
        return "japanese"
    else:
        # デフォルト：インデックスで振り分け
        cuisines = ["japanese", "western", "chinese"]
        return cuisines[index % 3]

def get_primary_protein(title):
    """主なタンパク質を判定"""
    if "鶏" in title or "チキン" in title:
        return "chicken"
    elif "豚" in title or "ポーク" in title:
        return "pork"
    elif "牛" in title or "ビーフ" in title:
        return "beef"
    elif "鮭" in title or "さば" in title or "アジ" in title or "イワシ" in title or "ブリ" in title or "タラ" in title or "魚" in title or "エビ" in title or "イカ" in title:
        return "fish"
    elif "卵" in title or "エッグ" in title:
        return "egg"
    elif "豆腐" in title or "大豆" in title:
        return "soy"
    else:
        return "other"

def get_cost_tier(role):
    """コスト層を判定"""
    if role == "main":
        return random.choice([500, 800, 1000])
    elif role == "side":
        return random.choice([300, 500])
    else:  # soup
        return random.choice([300, 500])

def generate_recipes():
    """600品のレシピを生成"""
    recipes = []
    
    # 主菜300品を生成
    print("主菜300品を生成中...")
    main_base = main_dishes_wa * 3 + main_dishes_yo * 3 + main_dishes_chu * 4
    for i in range(300):
        title = main_base[i % len(main_base)]
        # バリエーションを追加
        if i % 3 == 0:
            title = f"{title}（定番）"
        elif i % 3 == 1:
            title = f"{title}（アレンジ）"
        
        recipe = {
            "recipe_id": generate_recipe_id("main", 101 + i),
            "title": title,
            "role": "main",
            "cuisine": get_cuisine(title, i),
            "difficulty": random.choice(["easy", "normal", "hard"]),
            "time_min": generate_time("main"),
            "primary_protein": get_primary_protein(title),
            "cost_tier": get_cost_tier("main"),
            "child_friendly_score": generate_child_friendly_score(title),
            "description": f"{title}のレシピです。",
            "steps_json": json.dumps(["材料を準備", "調理", "盛り付け"], ensure_ascii=False),
            "substitutes_json": "[]",
            "tags_json": "[]",
            "season_json": "[]"
        }
        recipes.append(recipe)
    
    # 副菜200品を生成
    print("副菜200品を生成中...")
    side_base = side_dishes * 5
    for i in range(200):
        title = side_base[i % len(side_base)]
        if i % 4 == 0:
            title = f"{title}（定番）"
        elif i % 4 == 1:
            title = f"{title}（アレンジ）"
        
        recipe = {
            "recipe_id": generate_recipe_id("side", 101 + i),
            "title": title,
            "role": "side",
            "cuisine": get_cuisine(title, i),
            "difficulty": random.choice(["easy", "easy", "normal"]),
            "time_min": generate_time("side"),
            "primary_protein": get_primary_protein(title),
            "cost_tier": get_cost_tier("side"),
            "child_friendly_score": generate_child_friendly_score(title),
            "description": f"{title}のレシピです。",
            "steps_json": json.dumps(["材料を準備", "調理", "盛り付け"], ensure_ascii=False),
            "substitutes_json": "[]",
            "tags_json": "[]",
            "season_json": "[]"
        }
        recipes.append(recipe)
    
    # 汁物100品を生成
    print("汁物100品を生成中...")
    soup_base = soup_dishes * 4
    for i in range(100):
        title = soup_base[i % len(soup_base)]
        if i % 3 == 0:
            title = f"{title}（定番）"
        
        recipe = {
            "recipe_id": generate_recipe_id("soup", 101 + i),
            "title": title,
            "role": "soup",
            "cuisine": get_cuisine(title, i),
            "difficulty": random.choice(["easy", "easy", "normal"]),
            "time_min": generate_time("soup"),
            "primary_protein": get_primary_protein(title),
            "cost_tier": get_cost_tier("soup"),
            "child_friendly_score": generate_child_friendly_score(title),
            "description": f"{title}のレシピです。",
            "steps_json": json.dumps(["材料を準備", "調理", "盛り付け"], ensure_ascii=False),
            "substitutes_json": "[]",
            "tags_json": "[]",
            "season_json": "[]"
        }
        recipes.append(recipe)
    
    return recipes

def generate_sql_batches(recipes, batch_size=50):
    """SQLのバッチを生成"""
    batches = []
    
    for i in range(0, len(recipes), batch_size):
        batch = recipes[i:i+batch_size]
        sql_statements = []
        
        for recipe in batch:
            # Single quote escaping
            title = recipe['title'].replace("'", "''")
            description = recipe['description'].replace("'", "''")
            steps_json = recipe['steps_json'].replace("'", "''")
            
            sql = f"""INSERT OR IGNORE INTO recipes (
    recipe_id, title, description, role, cuisine, difficulty, time_min,
    primary_protein, cost_tier, child_friendly_score,
    steps_json, substitutes_json, tags_json, season_json
) VALUES (
    '{recipe['recipe_id']}', '{title}', '{description}', '{recipe['role']}',
    '{recipe['cuisine']}', '{recipe['difficulty']}', {recipe['time_min']},
    '{recipe['primary_protein']}', {recipe['cost_tier']}, {recipe['child_friendly_score']},
    '{steps_json}', '[]', '[]', '[]'
);"""
            sql_statements.append(sql)
        
        batches.append("\n".join(sql_statements))
    
    return batches

# ========================================
# メイン処理
# ========================================

if __name__ == "__main__":
    print("=" * 60)
    print("レシピ600品自動生成スクリプト")
    print("=" * 60)
    
    # レシピ生成
    recipes = generate_recipes()
    print(f"\n✅ 合計 {len(recipes)} 品のレシピを生成しました")
    print(f"  - 主菜: {len([r for r in recipes if r['role'] == 'main'])} 品")
    print(f"  - 副菜: {len([r for r in recipes if r['role'] == 'side'])} 品")
    print(f"  - 汁物: {len([r for r in recipes if r['role'] == 'soup'])} 品")
    
    # JSONファイルに保存
    with open('/home/user/webapp/scripts/recipes_600.json', 'w', encoding='utf-8') as f:
        json.dump(recipes, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSONファイルに保存しました: recipes_600.json")
    
    # SQLバッチファイルを生成
    batches = generate_sql_batches(recipes, batch_size=50)
    print(f"\n✅ SQLバッチファイルを生成中... ({len(batches)} ファイル)")
    
    for i, batch in enumerate(batches):
        filename = f"/home/user/webapp/migrations/0013_recipes_600_batch_{i+1:02d}.sql"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(batch)
        print(f"  - {filename}")
    
    print(f"\n✅ 完了しました！")
    print(f"\n次のステップ:")
    print(f"  1. ローカルDBに投入: for f in migrations/0013_recipes_600_batch_*.sql; do npx wrangler d1 execute aichef-production --local --file=$f; done")
    print(f"  2. 本番DBに投入: for f in migrations/0013_recipes_600_batch_*.sql; do npx wrangler d1 execute aichef-production --remote --file=$f; done")
