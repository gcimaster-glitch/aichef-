-- ========================================
-- 人気レシピ続き（チキン系、白身魚系など）
-- ========================================

-- チキンライス系（main_0219, main_0254）
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_0219', 'grain_rice', '2', '合', 0),
('main_0219', 'meat_chicken', '200', 'g', 0),
('main_0219', 'veg_onion', '1/2', '個', 0),
('main_0219', 'veg_green_pepper', '1', '個', 0),
('main_0219', 'seasoning_ketchup', '大さじ3', '大さじ', 0),
('main_0219', 'butter', '20', 'g', 0),

('main_0254', 'grain_rice', '2', '合', 0),
('main_0254', 'meat_chicken', '200', 'g', 0),
('main_0254', 'veg_onion', '1/2', '個', 0),
('main_0254', 'seasoning_ketchup', '大さじ3', '大さじ', 0),

-- 白身魚のムニエル系（main_0213, main_0248, main_0283）
('main_0213', 'fish_white', '4', '切れ', 0),
('main_0213', 'flour', '適量', '適量', 0),
('main_0213', 'butter', '30', 'g', 0),
('main_0213', 'seasoning_salt', '少々', '適量', 0),
('main_0213', 'seasoning_pepper', '少々', '適量', 0),

('main_0248', 'fish_white', '4', '切れ', 0),
('main_0248', 'flour', '適量', '適量', 0),
('main_0248', 'butter', '30', 'g', 0),
('main_0248', 'seasoning_salt', '少々', '適量', 0),
('main_0248', 'seasoning_pepper', '少々', '適量', 0),

('main_0283', 'fish_white', '4', '切れ', 0),
('main_0283', 'flour', '適量', '適量', 0),
('main_0283', 'butter', '30', 'g', 0),

-- ビーフストロガノフ系（main_0221, main_0256）
('main_0221', 'meat_beef', '400', 'g', 0),
('main_0221', 'veg_onion', '1', '個', 0),
('main_0221', 'veg_mushroom', '100', 'g', 0),
('main_0221', 'cream', '200', 'ml', 0),
('main_0221', 'butter', '20', 'g', 0),
('main_0221', 'flour', '大さじ2', '大さじ', 0),

('main_0256', 'meat_beef', '400', 'g', 0),
('main_0256', 'veg_onion', '1', '個', 0),
('main_0256', 'veg_mushroom', '100', 'g', 0),
('main_0256', 'cream', '200', 'ml', 0),

-- チキンフリカッセ系（main_0222, main_0257）
('main_0222', 'meat_chicken', '400', 'g', 0),
('main_0222', 'veg_onion', '1', '個', 0),
('main_0222', 'veg_mushroom', '100', 'g', 0),
('main_0222', 'cream', '200', 'ml', 0),
('main_0222', 'butter', '20', 'g', 0),
('main_0222', 'flour', '大さじ2', '大さじ', 0),

('main_0257', 'meat_chicken', '400', 'g', 0),
('main_0257', 'veg_onion', '1', '個', 0),
('main_0257', 'cream', '200', 'ml', 0),

-- ポークチャップ系（main_0223, main_0258）
('main_0223', 'meat_pork', '4', '枚', 0),
('main_0223', 'veg_onion', '1', '個', 0),
('main_0223', 'seasoning_ketchup', '大さじ4', '大さじ', 0),
('main_0223', 'seasoning_worcester', '大さじ2', '大さじ', 0),
('main_0223', 'seasoning_salt', '少々', '適量', 0),
('main_0223', 'seasoning_pepper', '少々', '適量', 0),
('main_0223', 'flour', '適量', '適量', 0),

('main_0258', 'meat_pork', '4', '枚', 0),
('main_0258', 'veg_onion', '1', '個', 0),
('main_0258', 'seasoning_ketchup', '大さじ4', '大さじ', 0),
('main_0258', 'seasoning_worcester', '大さじ2', '大さじ', 0),

-- タンドリーチキン系（main_0224, main_0259）
('main_0224', 'meat_chicken', '4', '枚', 0),
('main_0224', 'yogurt', '100', 'g', 0),
('main_0224', 'seasoning_ketchup', '大さじ2', '大さじ', 0),
('main_0224', 'spice_garlic', '1', '片', 0),
('main_0224', 'spice_ginger', '1', '片', 0),
('main_0224', 'seasoning_salt', '少々', '適量', 0),

('main_0259', 'meat_chicken', '4', '枚', 0),
('main_0259', 'yogurt', '100', 'g', 0),
('main_0259', 'seasoning_ketchup', '大さじ2', '大さじ', 0),

-- フィッシュアンドチップス系（main_0225, main_0260）
('main_0225', 'fish_white', '4', '切れ', 0),
('main_0225', 'flour', '100', 'g', 0),
('main_0225', 'ing_egg', '1', '個', 0),
('main_0225', 'water', '100', 'ml', 0),
('main_0225', 'veg_potato', '2', '個', 0),
('main_0225', 'oil_vegetable', '適量', '適量', 0),

('main_0260', 'fish_white', '4', '切れ', 0),
('main_0260', 'flour', '100', 'g', 0),
('main_0260', 'ing_egg', '1', '個', 0),
('main_0260', 'veg_potato', '2', '個', 0);
