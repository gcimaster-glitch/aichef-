-- 春巻き（定番）の材料を修正
DELETE FROM recipe_ingredients WHERE recipe_id = 'main_0356';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_0356', 'meat_pork_minced', 200, 'g', 0),
('main_0356', 'veg_cabbage', 100, 'g', 0),
('main_0356', 'veg_carrot', 50, 'g', 0),
('main_0356', 'mushroom_shiitake', 3, '個', 0),
('main_0356', 'seasoning_soy_sauce', 15, 'ml', 0),
('main_0356', 'seasoning_sesame_oil', 10, 'ml', 0),
('main_0356', 'seasoning_salt', 2, 'g', 0),
('main_0356', 'seasoning_pepper', 1, 'g', 0),
('main_0356', 'other_spring_roll_wrapper', 10, '枚', 0),
('main_0356', 'seasoning_oil', 500, 'ml', 0);

-- 春巻きのsteps_jsonを更新
UPDATE recipes SET 
  steps_json = '[
    "豚ひき肉、キャベツ、にんじん、しいたけをみじん切りにする",
    "フライパンで豚ひき肉を炒め、野菜を加えてさらに炒める",
    "醤油、ごま油、塩、こしょうで味付けし、冷ます",
    "春巻きの皮に具材を包む",
    "170度の油で4-5分、きつね色になるまで揚げる",
    "油を切って盛り付ける"
  ]',
  substitutes_json = '[
    {"original": "豚ひき肉", "alternatives": ["鶏ひき肉", "牛ひき肉"]},
    {"original": "キャベツ", "alternatives": ["白菜", "もやし"]},
    {"original": "しいたけ", "alternatives": ["エリンギ", "しめじ"]}
  ]'
WHERE recipe_id = 'main_0356';

-- 餃子の材料を修正（main_0144を想定）
DELETE FROM recipe_ingredients WHERE recipe_id = 'main_0144';

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_0144', 'meat_pork_minced', 200, 'g', 0),
('main_0144', 'veg_cabbage', 150, 'g', 0),
('main_0144', 'veg_nira', 50, 'g', 0),
('main_0144', 'seasoning_garlic', 1, 'かけ', 0),
('main_0144', 'seasoning_ginger', 1, 'かけ', 0),
('main_0144', 'seasoning_soy_sauce', 15, 'ml', 0),
('main_0144', 'seasoning_sesame_oil', 10, 'ml', 0),
('main_0144', 'seasoning_salt', 2, 'g', 0),
('main_0144', 'seasoning_pepper', 1, 'g', 0),
('main_0144', 'other_gyoza_wrapper', 30, '枚', 0),
('main_0144', 'seasoning_oil', 30, 'ml', 0);

-- 餃子のsteps_jsonを更新
UPDATE recipes SET 
  steps_json = '[
    "キャベツ、ニラをみじん切りにし、塩もみして水気を絞る",
    "豚ひき肉に野菜、みじん切りのにんにく・しょうが、調味料を加えてよく混ぜる",
    "餃子の皮に具材を包む",
    "フライパンに油を熱し、餃子を並べる",
    "焼き色がついたら水を加え、蓋をして蒸し焼きにする",
    "水分がなくなったら蓋を取り、カリッと焼き上げる"
  ]',
  substitutes_json = '[
    {"original": "豚ひき肉", "alternatives": ["鶏ひき肉", "エビ"]},
    {"original": "キャベツ", "alternatives": ["白菜", "もやし"]},
    {"original": "ニラ", "alternatives": ["長ねぎ", "青ネギ"]}
  ]'
WHERE recipe_id = 'main_0144';
