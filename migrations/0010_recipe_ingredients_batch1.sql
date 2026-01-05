-- レシピ-食材関連データ（第1バッチ: 主菜10品）

DELETE FROM recipe_ingredients;

-- main_011: 鶏の唐揚げ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_011', 'meat_chicken', 300, 'g'),
('main_011', 'seasoning_soy_sauce', 30, 'ml'),
('main_011', 'flour', 50, 'g'),
('main_011', 'oil_vegetable', 200, 'ml');

-- main_012: 豚カツ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_012', 'meat_pork', 250, 'g'),
('main_012', 'egg', 1, 'piece'),
('main_012', 'flour', 30, 'g'),
('main_012', 'bread_crumb', 50, 'g'),
('main_012', 'oil_vegetable', 300, 'ml');

-- main_013: 鮭の塩焼き
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_013', 'fish_salmon', 200, 'g'),
('main_013', 'seasoning_salt', 2, 'g');

-- main_014: サバの味噌煮
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_014', 'fish_mackerel', 200, 'g'),
('main_014', 'seasoning_miso', 40, 'g'),
('main_014', 'seasoning_sugar', 15, 'g'),
('main_014', 'seasoning_sake', 30, 'ml'),
('main_014', 'spice_ginger', 5, 'g');

-- main_015: 牛丼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_015', 'meat_beef', 200, 'g'),
('main_015', 'veg_onion', 1, 'piece'),
('main_015', 'seasoning_soy_sauce', 30, 'ml'),
('main_015', 'seasoning_mirin', 20, 'ml'),
('main_015', 'seasoning_sugar', 10, 'g');

-- main_016: 親子丼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_016', 'meat_chicken', 150, 'g'),
('main_016', 'egg', 2, 'piece'),
('main_016', 'veg_onion', 0.5, 'piece'),
('main_016', 'seasoning_soy_sauce', 20, 'ml'),
('main_016', 'seasoning_mirin', 15, 'ml');

-- main_017: カツ丼
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_017', 'meat_pork', 150, 'g'),
('main_017', 'egg', 2, 'piece'),
('main_017', 'veg_onion', 0.5, 'piece'),
('main_017', 'seasoning_soy_sauce', 20, 'ml'),
('main_017', 'bread_crumb', 50, 'g');

-- main_019: ハンバーグ
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_019', 'meat_ground_beef', 200, 'g'),
('main_019', 'veg_onion', 0.5, 'piece'),
('main_019', 'egg', 1, 'piece'),
('main_019', 'bread_crumb', 30, 'g'),
('main_019', 'seasoning_ketchup', 20, 'ml');

-- main_021: 麻婆豆腐
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_021', 'tofu_firm', 300, 'g'),
('main_021', 'meat_ground_pork', 100, 'g'),
('main_021', 'spice_garlic', 5, 'g'),
('main_021', 'spice_ginger', 5, 'g'),
('main_021', 'seasoning_soy_sauce', 15, 'ml'),
('main_021', 'seasoning_doubanjiang', 10, 'g');

-- main_022: 回鍋肉
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_022', 'meat_pork', 150, 'g'),
('main_022', 'veg_cabbage', 200, 'g'),
('main_022', 'veg_green_pepper', 1, 'piece'),
('main_022', 'seasoning_miso', 20, 'g'),
('main_022', 'seasoning_soy_sauce', 15, 'ml');
