-- レシピ-食材関連データ（簡略版）
-- 既存の食材IDを使用して主要30レシピに食材を紐付け

DELETE FROM recipe_ingredients;

-- 主菜 (15品)

-- main_011: 鶏の唐揚げ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_011', 'ing_chicken', 300, 'g'),
('main_011', 'ing_soy_sauce', 30, 'ml'),
('main_011', 'flour', 50, 'g'),
('main_011', 'ing_oil', 200, 'ml');

-- main_012: 豚カツ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_012', 'ing_pork', 250, 'g'),
('main_012', 'egg', 1, 'piece'),
('main_012', 'flour', 30, 'g'),
('main_012', 'bread_crumb', 50, 'g'),
('main_012', 'ing_oil', 300, 'ml');

-- main_013: 鮭の塩焼き
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_013', 'fish_salmon', 200, 'g'),
('main_013', 'ing_salt', 2, 'g');

-- main_014: サバの味噌煮
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_014', 'fish_mackerel', 200, 'g'),
('main_014', 'ing_miso', 40, 'g'),
('main_014', 'sugar', 15, 'g');

-- main_015: 牛丼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_015', 'meat_beef_slice', 200, 'g'),
('main_015', 'ing_onion', 1, 'piece'),
('main_015', 'ing_soy_sauce', 30, 'ml'),
('main_015', 'sugar', 10, 'g');

-- main_016: 親子丼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_016', 'ing_chicken', 150, 'g'),
('main_016', 'egg', 2, 'piece'),
('main_016', 'ing_onion', 0.5, 'piece'),
('main_016', 'ing_soy_sauce', 20, 'ml');

-- main_017: カツ丼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_017', 'ing_pork', 150, 'g'),
('main_017', 'egg', 2, 'piece'),
('main_017', 'ing_onion', 0.5, 'piece'),
('main_017', 'ing_soy_sauce', 20, 'ml'),
('main_017', 'bread_crumb', 50, 'g');

-- main_019: ハンバーグ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_019', 'ing_minced_meat', 200, 'g'),
('main_019', 'ing_onion', 0.5, 'piece'),
('main_019', 'egg', 1, 'piece'),
('main_019', 'bread_crumb', 30, 'g');

-- main_021: 麻婆豆腐
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_021', 'tofu', 300, 'g'),
('main_021', 'ing_minced_meat', 100, 'g'),
('main_021', 'ing_soy_sauce', 15, 'ml');

-- main_022: 回鍋肉
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_022', 'ing_pork', 150, 'g'),
('main_022', 'ing_cabbage', 200, 'g'),
('main_022', 'ing_green_pepper', 1, 'piece'),
('main_022', 'ing_miso', 20, 'g'),
('main_022', 'ing_soy_sauce', 15, 'ml');

-- main_023: 青椒肉絲
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_023', 'meat_beef_slice', 150, 'g'),
('main_023', 'ing_green_pepper', 2, 'piece'),
('main_023', 'ing_soy_sauce', 15, 'ml');

-- main_026: カレーライス
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_026', 'ing_pork', 150, 'g'),
('main_026', 'ing_potato', 2, 'piece'),
('main_026', 'ing_carrot', 1, 'piece'),
('main_026', 'ing_onion', 1, 'piece'),
('main_026', 'curry_roux', 100, 'g');

-- main_028: オムライス
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_028', 'egg', 3, 'piece'),
('main_028', 'ing_chicken', 100, 'g'),
('main_028', 'ing_onion', 0.5, 'piece'),
('main_028', 'ing_rice', 300, 'g');

-- main_031: 生姜焼き
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_031', 'ing_pork', 200, 'g'),
('main_031', 'ing_soy_sauce', 30, 'ml'),
('main_031', 'ing_cabbage', 100, 'g');

-- main_041: 肉じゃが
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_041', 'meat_beef_slice', 150, 'g'),
('main_041', 'ing_potato', 3, 'piece'),
('main_041', 'ing_carrot', 1, 'piece'),
('main_041', 'ing_onion', 1, 'piece'),
('main_041', 'ing_soy_sauce', 40, 'ml');

-- 副菜 (10品)

-- side_041: ポテトサラダ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_041', 'ing_potato', 2, 'piece'),
('side_041', 'ing_carrot', 0.5, 'piece'),
('side_041', 'ing_mayonnaise', 30, 'g'),
('side_041', 'ing_salt', 2, 'g');

-- side_042: きんぴらごぼう
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_042', 'veg_burdock', 100, 'g'),
('side_042', 'ing_carrot', 0.5, 'piece'),
('side_042', 'ing_soy_sauce', 15, 'ml');

-- side_043: ほうれん草のおひたし
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_043', 'veg_spinach', 150, 'g'),
('side_043', 'ing_soy_sauce', 10, 'ml');

-- side_046: キャベツの浅漬け
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_046', 'ing_cabbage', 200, 'g'),
('side_046', 'ing_salt', 5, 'g');

-- side_050: 温野菜サラダ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_050', 'veg_broccoli', 100, 'g'),
('side_050', 'ing_carrot', 0.5, 'piece'),
('side_050', 'ing_mayonnaise', 20, 'g'),
('side_050', 'ing_salt', 2, 'g');

-- side_055: もやしのナムル
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_055', 'ing_moyashi', 200, 'g'),
('side_055', 'ing_soy_sauce', 10, 'ml');

-- side_063: ツナサラダ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_063', 'ing_lettuce', 100, 'g'),
('side_063', 'canned_tuna', 70, 'g'),
('side_063', 'ing_mayonnaise', 20, 'g');

-- side_064: コールスロー
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_064', 'ing_cabbage', 200, 'g'),
('side_064', 'ing_carrot', 0.5, 'piece'),
('side_064', 'ing_mayonnaise', 30, 'g');

-- side_065: 大根サラダ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_065', 'ing_daikon', 200, 'g'),
('side_065', 'ing_negi', 20, 'g');

-- side_070: 枝豆
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('side_070', 'veg_edamame', 200, 'g'),
('side_070', 'ing_salt', 5, 'g');

-- 汁物 (5品)

-- soup_071: 味噌汁（豆腐とわかめ）
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('soup_071', 'tofu', 100, 'g'),
('soup_071', 'sea_wakame', 5, 'g'),
('soup_071', 'ing_miso', 30, 'g');

-- soup_074: 卵スープ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('soup_074', 'egg', 1, 'piece'),
('soup_074', 'ing_negi', 20, 'g');

-- soup_077: 豚汁
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('soup_077', 'ing_pork', 100, 'g'),
('soup_077', 'ing_daikon', 100, 'g'),
('soup_077', 'ing_carrot', 0.5, 'piece'),
('soup_077', 'ing_miso', 40, 'g');

-- soup_079: コーンスープ（洋風）
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('soup_079', 'canned_corn', 150, 'g'),
('soup_079', 'milk', 200, 'ml'),
('soup_079', 'butter', 10, 'g'),
('soup_079', 'ing_salt', 2, 'g');

-- soup_089: 野菜スープ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('soup_089', 'ing_cabbage', 100, 'g'),
('soup_089', 'ing_carrot', 0.5, 'piece'),
('soup_089', 'ing_onion', 0.5, 'piece');

-- 最初の3レシピ

-- rcp_001: 鶏むねの照り焼き
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('rcp_001', 'ing_chicken', 250, 'g'),
('rcp_001', 'ing_soy_sauce', 30, 'ml'),
('rcp_001', 'sugar', 10, 'g');

-- rcp_002: キャベツの浅漬け
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('rcp_002', 'ing_cabbage', 200, 'g'),
('rcp_002', 'ing_salt', 5, 'g');

-- rcp_003: 豆腐の味噌汁
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('rcp_003', 'tofu', 150, 'g'),
('rcp_003', 'sea_wakame', 5, 'g'),
('rcp_003', 'ing_miso', 30, 'g');
