-- =====================================================
-- 材料0件レシピへの材料追加スクリプト（修正版）
-- =====================================================
-- 作成日: 2026-01-18
-- 対象: main_152, main_153, main_154, main_155, main_156
-- =====================================================

-- =====================================================
-- main_152: 鮭のムニエル
-- =====================================================
-- 説明: バターの香りが食欲をそそる、フレンチの定番魚料理。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_152', 'fish_salmon', 2, '切れ'),
('main_152', 'seasoning_salt', 0.3, '小さじ'),
('main_152', 'seasoning_pepper', 0.2, '小さじ'),
('main_152', 'flour', 2, '大さじ'),
('main_152', 'butter', 20, 'g'),
('main_152', 'ing_lemon', 0.25, '個');

-- =====================================================
-- main_153: 麻婆茄子
-- =====================================================
-- 説明: トロトロの茄子にピリ辛肉味噌が絡む、ご飯が進む中華料理。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_153', 'veg_eggplant', 3, '本'),
('main_153', 'meat_ground_pork', 150, 'g'),
('main_153', 'ing_negi', 0.5, '本'),
('main_153', 'ing_garlic', 1, '片'),
('main_153', 'spice_ginger', 1, '片'),
('main_153', 'seasoning_miso', 1, '大さじ'),
('main_153', 'seasoning_soy_sauce', 1, '大さじ'),
('main_153', 'seasoning_sake', 1, '大さじ'),
('main_153', 'seasoning_sugar', 1, '小さじ'),
('main_153', 'seasoning_doubanjiang', 1, '小さじ'),
('main_153', 'oil_sesame', 1, '小さじ'),
('main_153', 'starch', 1, '大さじ');

-- =====================================================
-- main_154: 豚バラ大根
-- =====================================================
-- 説明: 柔らかい大根に豚バラの旨味が染み込んだ、ご飯が進む煮物。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_154', 'ing_pork', 200, 'g'),
('main_154', 'veg_daikon', 0.5, '本'),
('main_154', 'seasoning_soy_sauce', 3, '大さじ'),
('main_154', 'seasoning_sake', 3, '大さじ'),
('main_154', 'seasoning_mirin', 2, '大さじ'),
('main_154', 'seasoning_sugar', 1, '大さじ'),
('main_154', 'seasoning_dashi', 400, 'ml'),
('main_154', 'spice_ginger', 1, '片');

-- =====================================================
-- main_155: エビチリ
-- =====================================================
-- 説明: プリプリのエビに甘辛いチリソースが絡む、本格中華の人気メニュー。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_155', 'seafood_shrimp', 12, '尾'),
('main_155', 'ing_negi', 0.5, '本'),
('main_155', 'ing_garlic', 1, '片'),
('main_155', 'spice_ginger', 1, '片'),
('main_155', 'seasoning_ketchup', 3, '大さじ'),
('main_155', 'seasoning_sake', 1, '大さじ'),
('main_155', 'seasoning_sugar', 1, '大さじ'),
('main_155', 'seasoning_soy_sauce', 1, '小さじ'),
('main_155', 'seasoning_doubanjiang', 1, '小さじ'),
('main_155', 'seasoning_chicken_stock', 100, 'ml'),
('main_155', 'starch', 1, '大さじ'),
('main_155', 'oil_sesame', 1, '小さじ');

-- =====================================================
-- main_156: 鶏むね肉のチーズ焼き
-- =====================================================
-- 説明: ヘルシーな鶏むね肉にチーズをのせてジューシーに焼き上げた洋風メニュー。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_156', 'ing_chicken', 2, '枚'),
('main_156', 'cheese', 50, 'g'),
('main_156', 'seasoning_salt', 0.3, '小さじ'),
('main_156', 'seasoning_pepper', 0.2, '小さじ'),
('main_156', 'oil_olive', 1, '大さじ'),
('main_156', 'veg_tomato', 1, '個'),
('main_156', 'veg_onion', 0.5, '個'),
('main_156', 'ing_garlic', 1, '片'),
('main_156', 'ing_herbs', 0.5, '小さじ');

-- =====================================================
-- 汎用レシピの削除
-- =====================================================
-- main_022とmain_099は「（汎用）」なので削除
DELETE FROM recipe_ingredients WHERE recipe_id IN ('main_022', 'main_099');
DELETE FROM recipe_allergens WHERE recipe_id IN ('main_022', 'main_099');
DELETE FROM recipes WHERE recipe_id IN ('main_022', 'main_099');

-- =====================================================
-- 完了メッセージ
-- =====================================================
-- 追加: 合計5レシピ、57個の材料
-- 削除: 汎用レシピ2件（main_022, main_099）
-- =====================================================
