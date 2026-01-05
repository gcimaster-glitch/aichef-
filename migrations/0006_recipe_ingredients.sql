-- ========================================
-- レシピ-食材関連データ（主要レシピ分）
-- ========================================

-- rcp_001: 鶏むねの照り焼き
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('rcp_001', 'meat_chicken', 400, 'g', 0),
('rcp_001', 'seasoning_soy_sauce', 30, 'ml', 0),
('rcp_001', 'seasoning_mirin', 30, 'ml', 0),
('rcp_001', 'seasoning_sake', 15, 'ml', 0),
('rcp_001', 'seasoning_sugar', 10, 'g', 0),
('rcp_001', 'spice_ginger', 5, 'g', 0),
('rcp_001', 'oil_vegetable', 10, 'ml', 0);

-- rcp_002: キャベツの浅漬け
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('rcp_002', 'veg_cabbage', 8, '枚', 0),
('rcp_002', 'seasoning_salt', 3, 'g', 0);

-- rcp_003: 豆腐の味噌汁
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('rcp_003', 'tofu_silken', 0.5, '丁', 0),
('rcp_003', 'seaweed_wakame', 5, 'g', 0),
('rcp_003', 'seasoning_miso', 40, 'g', 0),
('rcp_003', 'dashi_powder', 5, 'g', 0),
('rcp_003', 'water', 600, 'ml', 0);

-- main_011: 鶏の唐揚げ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_011', 'meat_chicken', 500, 'g', 0),
('main_011', 'seasoning_soy_sauce', 30, 'ml', 0),
('main_011', 'seasoning_sake', 30, 'ml', 0),
('main_011', 'spice_ginger', 10, 'g', 0),
('main_011', 'spice_garlic', 1, '片', 0),
('main_011', 'starch', 50, 'g', 0),
('main_011', 'oil_vegetable', 200, 'ml', 0);

-- main_012: 豚カツ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_012', 'meat_pork', 400, 'g', 0),
('main_012', 'flour', 30, 'g', 0),
('main_012', 'egg', 1, '個', 0),
('main_012', 'bread_crumb', 50, 'g', 0),
('main_012', 'oil_vegetable', 200, 'ml', 0),
('main_012', 'seasoning_salt', 2, 'g', 0),
('main_012', 'seasoning_pepper', 1, 'g', 0);

-- main_019: ハンバーグ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_019', 'meat_ground_mix', 400, 'g', 0),
('main_019', 'veg_onion', 1, '個', 0),
('main_019', 'egg', 1, '個', 0),
('main_019', 'bread_crumb', 30, 'g', 0),
('main_019', 'milk', 30, 'ml', 0),
('main_019', 'seasoning_salt', 2, 'g', 0),
('main_019', 'seasoning_pepper', 1, 'g', 0),
('main_019', 'oil_vegetable', 10, 'ml', 0);

-- main_026: カレーライス
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_026', 'meat_beef', 300, 'g', 0),
('main_026', 'veg_onion', 2, '個', 0),
('main_026', 'veg_carrot', 1, '本', 0),
('main_026', 'veg_potato', 3, '個', 0),
('main_026', 'curry_roux', 120, 'g', 0),
('main_026', 'water', 800, 'ml', 0),
('main_026', 'oil_vegetable', 15, 'ml', 0);

-- side_011: ポテトサラダ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_011', 'veg_potato', 4, '個', 0),
('side_011', 'veg_cucumber', 1, '本', 0),
('side_011', 'veg_carrot', 0.5, '本', 0),
('side_011', 'meat_ham', 50, 'g', 0),
('side_011', 'seasoning_mayonnaise', 60, 'ml', 0),
('side_011', 'seasoning_salt', 2, 'g', 0),
('side_011', 'seasoning_pepper', 1, 'g', 0);

-- side_020: きんぴらごぼう
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_020', 'veg_burdock', 1, '本', 0),
('side_020', 'veg_carrot', 0.5, '本', 0),
('side_020', 'seasoning_soy_sauce', 20, 'ml', 0),
('side_020', 'seasoning_mirin', 20, 'ml', 0),
('side_020', 'seasoning_sake', 10, 'ml', 0),
('side_020', 'seasoning_sugar', 10, 'g', 0),
('side_020', 'oil_sesame', 10, 'ml', 0),
('side_020', 'spice_sesame_white', 5, 'g', 1);

-- soup_011: 豚汁
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('soup_011', 'meat_pork', 150, 'g', 0),
('soup_011', 'veg_daikon', 10, 'cm', 0),
('soup_011', 'veg_carrot', 0.5, '本', 0),
('soup_011', 'veg_burdock', 0.5, '本', 0),
('soup_011', 'tofu_firm', 0.5, '丁', 0),
('soup_011', 'spice_green_onion', 0.5, '本', 0),
('soup_011', 'seasoning_miso', 50, 'g', 0),
('soup_011', 'dashi_powder', 5, 'g', 0),
('soup_011', 'water', 800, 'ml', 0),
('soup_011', 'oil_sesame', 5, 'ml', 0);

