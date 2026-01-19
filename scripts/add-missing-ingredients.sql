-- =====================================================
-- 材料0件レシピへの材料追加スクリプト
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
('main_152', 'seas_salt', 0.3, '小さじ'),
('main_152', 'seas_pepper', 0.2, '小さじ'),
('main_152', 'other_flour', 2, '大さじ'),
('main_152', 'dairy_butter', 20, 'g'),
('main_152', 'veg_lemon', 0.25, '個');

-- =====================================================
-- main_153: 麻婆茄子
-- =====================================================
-- 説明: トロトロの茄子にピリ辛肉味噌が絡む、ご飯が進む中華料理。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_153', 'veg_eggplant', 3, '本'),
('main_153', 'meat_ground_pork', 150, 'g'),
('main_153', 'veg_negi', 0.5, '本'),
('main_153', 'other_garlic', 1, '片'),
('main_153', 'other_ginger', 1, '片'),
('main_153', 'seas_miso', 1, '大さじ'),
('main_153', 'seas_soy_sauce', 1, '大さじ'),
('main_153', 'seas_sake', 1, '大さじ'),
('main_153', 'seas_sugar', 1, '小さじ'),
('main_153', 'seas_doubanjiang', 1, '小さじ'),
('main_153', 'seas_sesame_oil', 1, '小さじ'),
('main_153', 'other_starch', 1, '大さじ');

-- =====================================================
-- main_154: 豚バラ大根
-- =====================================================
-- 説明: 柔らかい大根に豚バラの旨味が染み込んだ、ご飯が進む煮物。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_154', 'meat_pork_belly', 200, 'g'),
('main_154', 'veg_daikon', 0.5, '本'),
('main_154', 'seas_soy_sauce', 3, '大さじ'),
('main_154', 'seas_sake', 3, '大さじ'),
('main_154', 'seas_mirin', 2, '大さじ'),
('main_154', 'seas_sugar', 1, '大さじ'),
('main_154', 'seas_dashi', 400, 'ml'),
('main_154', 'other_ginger', 1, '片');

-- =====================================================
-- main_155: エビチリ
-- =====================================================
-- 説明: プリプリのエビに甘辛いチリソースが絡む、本格中華の人気メニュー。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_155', 'seafood_shrimp', 12, '尾'),
('main_155', 'veg_negi', 0.5, '本'),
('main_155', 'other_garlic', 1, '片'),
('main_155', 'other_ginger', 1, '片'),
('main_155', 'seas_ketchup', 3, '大さじ'),
('main_155', 'seas_sake', 1, '大さじ'),
('main_155', 'seas_sugar', 1, '大さじ'),
('main_155', 'seas_soy_sauce', 1, '小さじ'),
('main_155', 'seas_doubanjiang', 1, '小さじ'),
('main_155', 'seas_chicken_stock', 100, 'ml'),
('main_155', 'other_starch', 1, '大さじ'),
('main_155', 'seas_sesame_oil', 1, '小さじ');

-- =====================================================
-- main_156: 鶏むね肉のチーズ焼き
-- =====================================================
-- 説明: ヘルシーな鶏むね肉にチーズをのせてジューシーに焼き上げた洋風メニュー。

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
('main_156', 'meat_chicken_breast', 2, '枚'),
('main_156', 'dairy_cheese', 50, 'g'),
('main_156', 'seas_salt', 0.3, '小さじ'),
('main_156', 'seas_pepper', 0.2, '小さじ'),
('main_156', 'seas_olive_oil', 1, '大さじ'),
('main_156', 'veg_tomato', 1, '個'),
('main_156', 'veg_onion', 0.5, '個'),
('main_156', 'other_garlic', 1, '片'),
('main_156', 'seas_herbs', 0.5, '小さじ');

-- =====================================================
-- 完了メッセージ
-- =====================================================
-- 合計5レシピ、57個の材料を追加しました
-- main_152: 6材料
-- main_153: 12材料
-- main_154: 8材料
-- main_155: 12材料
-- main_156: 9材料
-- =====================================================
