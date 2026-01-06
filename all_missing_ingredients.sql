-- ========================================
-- 人気レシピ50件の食材データ
-- ========================================

-- ハンバーグ系（main_019, main_0191, main_0226, main_0261）
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('main_019', 'meat_ground_mix', '400', 'g', 0),
('main_019', 'veg_onion', '1', '個', 0),
('main_019', 'ing_egg', '1', '個', 0),
('main_019', 'bread_crumb', '60', 'g', 0),
('main_019', 'milk', '50', 'ml', 0),
('main_019', 'seasoning_salt', '少々', '適量', 0),
('main_019', 'seasoning_pepper', '少々', '適量', 0),
('main_019', 'oil_vegetable', '大さじ1', '大さじ', 0),
('main_019', 'seasoning_ketchup', '大さじ3', '大さじ', 0),
('main_019', 'seasoning_worcester', '大さじ2', '大さじ', 0),

('main_0191', 'meat_ground_mix', '400', 'g', 0),
('main_0191', 'veg_onion', '1', '個', 0),
('main_0191', 'ing_egg', '1', '個', 0),
('main_0191', 'bread_crumb', '60', 'g', 0),
('main_0191', 'milk', '50', 'ml', 0),
('main_0191', 'seasoning_salt', '少々', '適量', 0),
('main_0191', 'seasoning_pepper', '少々', '適量', 0),
('main_0191', 'oil_vegetable', '大さじ1', '大さじ', 0),

('main_0226', 'meat_ground_mix', '400', 'g', 0),
('main_0226', 'veg_onion', '1', '個', 0),
('main_0226', 'ing_egg', '1', '個', 0),
('main_0226', 'bread_crumb', '60', 'g', 0),
('main_0226', 'milk', '50', 'ml', 0),

('main_0261', 'meat_ground_mix', '400', 'g', 0),
('main_0261', 'veg_onion', '1', '個', 0),
('main_0261', 'ing_egg', '1', '個', 0),
('main_0261', 'bread_crumb', '60', 'g', 0),
('main_0261', 'milk', '50', 'ml', 0),
('main_0261', 'cheese', '50', 'g', 1),

-- ビーフシチュー系（main_0192, main_0227, main_0262）
('main_0192', 'meat_beef', '400', 'g', 0),
('main_0192', 'veg_onion', '1', '個', 0),
('main_0192', 'veg_carrot', '1', '本', 0),
('main_0192', 'veg_potato', '2', '個', 0),
('main_0192', 'stew_roux', '1', '箱', 0),
('main_0192', 'butter', '20', 'g', 0),
('main_0192', 'water', '800', 'ml', 0),

('main_0227', 'meat_beef', '400', 'g', 0),
('main_0227', 'veg_onion', '1', '個', 0),
('main_0227', 'veg_carrot', '1', '本', 0),
('main_0227', 'veg_potato', '2', '個', 0),
('main_0227', 'stew_roux', '1', '箱', 0),
('main_0227', 'water', '800', 'ml', 0),

('main_0262', 'meat_beef', '400', 'g', 0),
('main_0262', 'veg_onion', '1', '個', 0),
('main_0262', 'veg_carrot', '1', '本', 0),
('main_0262', 'veg_potato', '2', '個', 0),
('main_0262', 'stew_roux', '1', '箱', 0),
('main_0262', 'butter', '20', 'g', 0),

-- ミートボール系（main_020, main_0198, main_0233, main_0268）
('main_020', 'meat_ground_mix', '400', 'g', 0),
('main_020', 'veg_onion', '1/2', '個', 0),
('main_020', 'ing_egg', '1', '個', 0),
('main_020', 'bread_crumb', '40', 'g', 0),
('main_020', 'seasoning_ketchup', '大さじ4', '大さじ', 0),
('main_020', 'seasoning_sugar', '大さじ2', '大さじ', 0),
('main_020', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),
('main_020', 'seasoning_vinegar', '大さじ1', '大さじ', 0),

('main_0198', 'meat_ground_mix', '400', 'g', 0),
('main_0198', 'veg_onion', '1/2', '個', 0),
('main_0198', 'ing_egg', '1', '個', 0),
('main_0198', 'bread_crumb', '40', 'g', 0),

('main_0233', 'meat_ground_mix', '400', 'g', 0),
('main_0233', 'veg_onion', '1/2', '個', 0),
('main_0233', 'ing_egg', '1', '個', 0),
('main_0233', 'bread_crumb', '40', 'g', 0),

('main_0268', 'meat_ground_mix', '400', 'g', 0),
('main_0268', 'veg_onion', '1/2', '個', 0),
('main_0268', 'ing_egg', '1', '個', 0),
('main_0268', 'bread_crumb', '40', 'g', 0),

-- 春巻き系（main_0306, main_0331, main_0356, main_0381）
('main_0306', 'meat_ground_pork', '200', 'g', 0),
('main_0306', 'veg_cabbage', '150', 'g', 0),
('main_0306', 'veg_carrot', '50', 'g', 0),
('main_0306', 'veg_green_pepper', '2', '個', 0),
('main_0306', 'noodle_harusame', '40', 'g', 0),
('main_0306', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),
('main_0306', 'seasoning_oyster', '大さじ1', '大さじ', 0),
('main_0306', 'oil_sesame', '大さじ1', '大さじ', 0),
('main_0306', 'flour', '大さじ2', '大さじ', 0),
('main_0306', 'water', '大さじ2', '大さじ', 0),

('main_0331', 'meat_ground_pork', '200', 'g', 0),
('main_0331', 'veg_cabbage', '150', 'g', 0),
('main_0331', 'veg_carrot', '50', 'g', 0),
('main_0331', 'noodle_harusame', '40', 'g', 0),
('main_0331', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),
('main_0331', 'seasoning_oyster', '大さじ1', '大さじ', 0),
('main_0331', 'oil_sesame', '大さじ1', '大さじ', 0),
('main_0331', 'flour', '大さじ2', '大さじ', 0),

('main_0356', 'meat_ground_pork', '200', 'g', 0),
('main_0356', 'veg_cabbage', '150', 'g', 0),
('main_0356', 'veg_carrot', '50', 'g', 0),
('main_0356', 'noodle_harusame', '40', 'g', 0),
('main_0356', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),
('main_0356', 'oil_sesame', '大さじ1', '大さじ', 0),

('main_0381', 'meat_ground_pork', '200', 'g', 0),
('main_0381', 'veg_cabbage', '150', 'g', 0),
('main_0381', 'veg_carrot', '50', 'g', 0),
('main_0381', 'noodle_harusame', '40', 'g', 0),
('main_0381', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),

-- マカロニサラダ（side_012）
('side_012', 'noodle_pasta', '150', 'g', 0),
('side_012', 'veg_cucumber', '1', '本', 0),
('side_012', 'veg_carrot', '1/2', '本', 0),
('side_012', 'canned_corn', '50', 'g', 0),
('side_012', 'meat_ham', '4', '枚', 0),
('side_012', 'seasoning_mayonnaise', '大さじ4', '大さじ', 0),
('side_012', 'seasoning_salt', '少々', '適量', 0),
('side_012', 'seasoning_pepper', '少々', '適量', 0),

-- グラタン系（main_0200, main_0235, main_0270）
('main_0200', 'noodle_pasta', '150', 'g', 0),
('main_0200', 'meat_chicken', '200', 'g', 0),
('main_0200', 'veg_onion', '1', '個', 0),
('main_0200', 'veg_mushroom', '100', 'g', 0),
('main_0200', 'butter', '30', 'g', 0),
('main_0200', 'flour', '30', 'g', 0),
('main_0200', 'milk', '400', 'ml', 0),
('main_0200', 'cheese', '100', 'g', 0),

('main_0235', 'noodle_pasta', '150', 'g', 0),
('main_0235', 'meat_chicken', '200', 'g', 0),
('main_0235', 'veg_onion', '1', '個', 0),
('main_0235', 'butter', '30', 'g', 0),
('main_0235', 'flour', '30', 'g', 0),
('main_0235', 'milk', '400', 'ml', 0),
('main_0235', 'cheese', '100', 'g', 0),

('main_0270', 'noodle_pasta', '150', 'g', 0),
('main_0270', 'meat_chicken', '200', 'g', 0),
('main_0270', 'veg_onion', '1', '個', 0),
('main_0270', 'butter', '30', 'g', 0),
('main_0270', 'flour', '30', 'g', 0),
('main_0270', 'milk', '400', 'ml', 0),
('main_0270', 'cheese', '100', 'g', 0),

-- スパゲッティミートソース系（main_0206, main_0241, main_0276）
('main_0206', 'noodle_pasta', '320', 'g', 0),
('main_0206', 'meat_ground_mix', '300', 'g', 0),
('main_0206', 'veg_onion', '1', '個', 0),
('main_0206', 'veg_carrot', '1/2', '本', 0),
('main_0206', 'canned_tomato', '1', '缶', 0),
('main_0206', 'seasoning_ketchup', '大さじ3', '大さじ', 0),
('main_0206', 'seasoning_worcester', '大さじ1', '大さじ', 0),
('main_0206', 'oil_olive', '大さじ1', '大さじ', 0),

('main_0241', 'noodle_pasta', '320', 'g', 0),
('main_0241', 'meat_ground_mix', '300', 'g', 0),
('main_0241', 'veg_onion', '1', '個', 0),
('main_0241', 'canned_tomato', '1', '缶', 0),
('main_0241', 'seasoning_ketchup', '大さじ3', '大さじ', 0),

('main_0276', 'noodle_pasta', '320', 'g', 0),
('main_0276', 'meat_ground_mix', '300', 'g', 0),
('main_0276', 'veg_onion', '1', '個', 0),
('main_0276', 'canned_tomato', '1', '缶', 0),

-- カルボナーラ系（main_0207, main_0242, main_0277）
('main_0207', 'noodle_pasta', '320', 'g', 0),
('main_0207', 'meat_bacon', '100', 'g', 0),
('main_0207', 'ing_egg', '3', '個', 0),
('main_0207', 'cheese', '60', 'g', 0),
('main_0207', 'milk', '100', 'ml', 0),
('main_0207', 'seasoning_salt', '少々', '適量', 0),
('main_0207', 'seasoning_pepper', '少々', '適量', 0),

('main_0242', 'noodle_pasta', '320', 'g', 0),
('main_0242', 'meat_bacon', '100', 'g', 0),
('main_0242', 'ing_egg', '3', '個', 0),
('main_0242', 'cheese', '60', 'g', 0),
('main_0242', 'milk', '100', 'ml', 0),

('main_0277', 'noodle_pasta', '320', 'g', 0),
('main_0277', 'meat_bacon', '100', 'g', 0),
('main_0277', 'ing_egg', '3', '個', 0),
('main_0277', 'cheese', '60', 'g', 0),

-- ペペロンチーノ系（main_0208, main_0243, main_0278）
('main_0208', 'noodle_pasta', '320', 'g', 0),
('main_0208', 'spice_garlic', '2', '片', 0),
('main_0208', 'oil_olive', '大さじ3', '大さじ', 0),
('main_0208', 'seasoning_chili_oil', '小さじ1', '小さじ', 0),
('main_0208', 'seasoning_salt', '少々', '適量', 0),
('main_0208', 'seasoning_pepper', '少々', '適量', 0),

('main_0243', 'noodle_pasta', '320', 'g', 0),
('main_0243', 'spice_garlic', '2', '片', 0),
('main_0243', 'oil_olive', '大さじ3', '大さじ', 0),
('main_0243', 'seasoning_chili_oil', '小さじ1', '小さじ', 0),

('main_0278', 'noodle_pasta', '320', 'g', 0),
('main_0278', 'spice_garlic', '2', '片', 0),
('main_0278', 'oil_olive', '大さじ3', '大さじ', 0),

-- ナポリタン系（main_0209, main_0244, main_0279）
('main_0209', 'noodle_pasta', '320', 'g', 0),
('main_0209', 'meat_sausage', '4', '本', 0),
('main_0209', 'veg_onion', '1', '個', 0),
('main_0209', 'veg_green_pepper', '2', '個', 0),
('main_0209', 'veg_mushroom', '4', '個', 0),
('main_0209', 'seasoning_ketchup', '大さじ6', '大さじ', 0),
('main_0209', 'seasoning_worcester', '大さじ1', '大さじ', 0),
('main_0209', 'butter', '20', 'g', 0),

('main_0244', 'noodle_pasta', '320', 'g', 0),
('main_0244', 'meat_sausage', '4', '本', 0),
('main_0244', 'veg_onion', '1', '個', 0),
('main_0244', 'veg_green_pepper', '2', '個', 0),
('main_0244', 'seasoning_ketchup', '大さじ6', '大さじ', 0),

('main_0279', 'noodle_pasta', '320', 'g', 0),
('main_0279', 'meat_sausage', '4', '本', 0),
('main_0279', 'veg_onion', '1', '個', 0),
('main_0279', 'veg_green_pepper', '2', '個', 0),
('main_0279', 'seasoning_ketchup', '大さじ6', '大さじ', 0),

-- オムライス系（main_028, main_0216, main_0251）
('main_028', 'ing_egg', '4', '個', 0),
('main_028', 'grain_rice', '2', '合', 0),
('main_028', 'meat_chicken', '100', 'g', 0),
('main_028', 'veg_onion', '1/2', '個', 0),
('main_028', 'seasoning_ketchup', '大さじ4', '大さじ', 0),
('main_028', 'butter', '20', 'g', 0),
('main_028', 'milk', '大さじ2', '大さじ', 0),

('main_0216', 'ing_egg', '4', '個', 0),
('main_0216', 'grain_rice', '2', '合', 0),
('main_0216', 'meat_chicken', '100', 'g', 0),
('main_0216', 'veg_onion', '1/2', '個', 0),
('main_0216', 'seasoning_ketchup', '大さじ4', '大さじ', 0),

('main_0251', 'ing_egg', '4', '個', 0),
('main_0251', 'grain_rice', '2', '合', 0),
('main_0251', 'meat_chicken', '100', 'g', 0),
('main_0251', 'veg_onion', '1/2', '個', 0),
('main_0251', 'seasoning_ketchup', '大さじ4', '大さじ', 0),

-- ドリア系（main_0217, main_0252）
('main_0217', 'grain_rice', '2', '合', 0),
('main_0217', 'meat_ground_mix', '200', 'g', 0),
('main_0217', 'veg_onion', '1', '個', 0),
('main_0217', 'butter', '30', 'g', 0),
('main_0217', 'flour', '30', 'g', 0),
('main_0217', 'milk', '400', 'ml', 0),
('main_0217', 'cheese', '100', 'g', 0),

('main_0252', 'grain_rice', '2', '合', 0),
('main_0252', 'meat_ground_mix', '200', 'g', 0),
('main_0252', 'veg_onion', '1', '個', 0),
('main_0252', 'butter', '30', 'g', 0),
('main_0252', 'flour', '30', 'g', 0),
('main_0252', 'milk', '400', 'ml', 0),
('main_0252', 'cheese', '100', 'g', 0),

-- 回鍋肉（main_022）
('main_022', 'meat_pork', '300', 'g', 0),
('main_022', 'veg_cabbage', '1/4', '個', 0),
('main_022', 'veg_green_pepper', '2', '個', 0),
('main_022', 'spice_green_onion', '1', '本', 0),
('main_022', 'seasoning_doubanjiang', '小さじ1', '小さじ', 0),
('main_022', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),
('main_022', 'seasoning_sake', '大さじ1', '大さじ', 0),
('main_022', 'oil_vegetable', '大さじ1', '大さじ', 0),

-- 青椒肉絲（main_023）
('main_023', 'meat_pork', '300', 'g', 0),
('main_023', 'veg_green_pepper', '4', '個', 0),
('main_023', 'veg_onion', '1/2', '個', 0),
('main_023', 'seasoning_oyster', '大さじ1', '大さじ', 0),
('main_023', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0),
('main_023', 'oil_sesame', '大さじ1', '大さじ', 0),

-- ピザトースト系（main_0218, main_0253）
('main_0218', 'grain_bread', '4', '枚', 0),
('main_0218', 'seasoning_ketchup', '大さじ4', '大さじ', 0),
('main_0218', 'cheese', '100', 'g', 0),
('main_0218', 'veg_onion', '1/2', '個', 0),
('main_0218', 'veg_green_pepper', '1', '個', 0),
('main_0218', 'meat_ham', '4', '枚', 0),

('main_0253', 'grain_bread', '4', '枚', 0),
('main_0253', 'seasoning_ketchup', '大さじ4', '大さじ', 0),
('main_0253', 'cheese', '100', 'g', 0),
('main_0253', 'veg_onion', '1/2', '個', 0),
('main_0253', 'meat_ham', '4', '枚', 0);
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
-- ========================================
-- 残り170件のレシピの基本食材データ
-- ========================================

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0286', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0286', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0286', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0286', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0287', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0287', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0287', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0287', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0288', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0288', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0288', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0288', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0289', 'meat_chicken', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0289', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0289', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0289', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0289', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_029', 'meat_chicken', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_029', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_029', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_029', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_029', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0291', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0291', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0291', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0291', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0291', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0291', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0292', 'meat_chicken', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0292', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0292', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0292', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0292', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0293', 'meat_pork', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0293', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0293', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0293', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0293', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0294', 'meat_chicken', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0294', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0294', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0294', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0294', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0295', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0295', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0295', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0295', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0297', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0297', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0297', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0297', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0298', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0298', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0298', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0298', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0299', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0299', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0299', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0299', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_030', 'meat_chicken', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_030', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_030', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_030', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_030', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0305', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0305', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0305', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0305', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0307', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0307', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0307', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0307', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0308', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0308', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0308', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0308', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0310', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0310', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0310', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0310', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0316', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0316', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0316', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0316', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0320', 'fish_white', '4', '切れ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0320', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0320', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0320', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0322', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0322', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0322', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0322', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0323', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0323', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0323', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0323', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0324', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0324', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0324', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0324', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_033', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_033', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_033', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_033', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_033', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_033', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0330', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0330', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0330', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0330', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0332', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0332', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0332', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0332', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0333', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0333', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0333', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0333', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0335', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0335', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0335', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0335', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_034', 'meat_chicken', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_034', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_034', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_034', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_034', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0341', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0341', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0341', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0341', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0345', 'fish_white', '4', '切れ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0345', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0345', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0345', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0347', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0347', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0347', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0347', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0348', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0348', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0348', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0348', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0349', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0349', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0349', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0349', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0355', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0355', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0355', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0355', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0357', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0357', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0357', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0357', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0358', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0358', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0358', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0358', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0360', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0360', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0360', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0360', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0366', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0366', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0366', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0366', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0370', 'fish_white', '4', '切れ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0370', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0370', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0370', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0372', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0372', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0372', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0372', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0373', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0373', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0373', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0373', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0374', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0374', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0374', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0374', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0380', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0380', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0380', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0380', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0382', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0382', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0382', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0382', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0383', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0383', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0383', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0383', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0385', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0385', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0385', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0385', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0391', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0391', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0391', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0391', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0395', 'fish_white', '4', '切れ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0395', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0395', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_0395', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_046', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_046', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_046', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_046', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_046', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_046', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_047', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_047', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_047', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_047', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_047', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_047', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_048', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_048', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_048', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_048', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_048', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_048', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_049', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_049', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_049', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_049', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_049', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_049', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_054', 'meat_beef', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_054', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_054', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_054', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_054', 'seasoning_pepper', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_054', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_055', 'meat_pork', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_055', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_055', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_055', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_055', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_056', 'meat_pork', '300', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_056', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_056', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_056', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_056', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_058', 'ing_egg', '4', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_058', 'veg_onion', '1', '個', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_058', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('main_058', 'oil_vegetable', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0106', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0106', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0106', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0106', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0107', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0107', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0107', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0107', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_011', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_011', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_011', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_011', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0116', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0116', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0116', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0116', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0120', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0120', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0120', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0120', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0124', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0124', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0124', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0124', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0125', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0125', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0125', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0125', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0128', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0128', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0128', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0128', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_013', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_013', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_013', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_013', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0130', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0130', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0130', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0130', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0131', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0131', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0131', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0131', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0134', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0134', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0134', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0134', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0135', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0135', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0135', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0135', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0136', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0136', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0136', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0136', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0137', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0137', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0137', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0137', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0138', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0138', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0138', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0138', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0139', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0139', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0139', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0139', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_014', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_014', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_014', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_014', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0146', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0146', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0146', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0146', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0147', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0147', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0147', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0147', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0156', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0156', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0156', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0156', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0160', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0160', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0160', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0160', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0164', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0164', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0164', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0164', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0165', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0165', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0165', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0165', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0168', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0168', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0168', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0168', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_017', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_017', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_017', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_017', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0170', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0170', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0170', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0170', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0171', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0171', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0171', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0171', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0174', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0174', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0174', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0174', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0175', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0175', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0175', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0175', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0176', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0176', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0176', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0176', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0177', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0177', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0177', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0177', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0178', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0178', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0178', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0178', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0179', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0179', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0179', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0179', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_018', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_018', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_018', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_018', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0186', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0186', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0186', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0186', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0187', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0187', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0187', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0187', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_019', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_019', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_019', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_019', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0196', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0196', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0196', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0196', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0200', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0200', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0200', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0200', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0204', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0204', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0204', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0204', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0205', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0205', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0205', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0205', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0208', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0208', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0208', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0208', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0210', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0210', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0210', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0210', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0211', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0211', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0211', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0211', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0214', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0214', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0214', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0214', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0215', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0215', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0215', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0215', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0216', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0216', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0216', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0216', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0217', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0217', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0217', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0217', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0218', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0218', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0218', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0218', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0219', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0219', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0219', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0219', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0226', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0226', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0226', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0226', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0227', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0227', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0227', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0227', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0236', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0236', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0236', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0236', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0240', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0240', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0240', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0240', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0244', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0244', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0244', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0244', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0245', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0245', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0245', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0245', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0248', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0248', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0248', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0248', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0250', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0250', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0250', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0250', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0251', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0251', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0251', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0251', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0254', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0254', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0254', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0254', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0255', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0255', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0255', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0255', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0256', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0256', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0256', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0256', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0257', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0257', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0257', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0257', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0258', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0258', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0258', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0258', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0259', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0259', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0259', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0259', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_026', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_026', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_026', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_026', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0266', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0266', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0266', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0266', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0267', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0267', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0267', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0267', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_027', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_027', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_027', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_027', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0276', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0276', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0276', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0276', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0280', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0280', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0280', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0280', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0284', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0284', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0284', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0284', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0285', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0285', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0285', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0285', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0288', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0288', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0288', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0288', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0290', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0290', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0290', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0290', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0291', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0291', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0291', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0291', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0294', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0294', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0294', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0294', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0295', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0295', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0295', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0295', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0296', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0296', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0296', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0296', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0297', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0297', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0297', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0297', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0298', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0298', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0298', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0298', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0299', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0299', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0299', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_0299', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_030', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_030', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_030', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_030', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_032', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_032', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_032', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_032', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_036', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_036', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_036', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_036', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_038', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_038', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_038', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_038', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_040', 'veg_cabbage', '100', 'g', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_040', 'veg_carrot', '1/2', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_040', 'seasoning_salt', '少々', '適量', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('side_040', 'seasoning_soy_sauce', '大さじ1', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0106', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0106', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0106', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0106', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0106', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0107', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0107', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0107', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0107', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0107', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0113', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0113', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0113', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0113', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0113', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0114', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0114', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0114', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0114', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0114', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_012', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_012', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_012', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_012', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_012', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_013', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_013', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_013', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_013', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_013', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0131', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0131', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0131', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0131', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0131', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0132', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0132', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0132', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0132', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0132', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0138', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0138', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0138', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0138', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0138', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0139', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0139', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0139', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0139', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0139', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0156', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0156', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0156', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0156', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0156', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0157', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0157', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0157', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0157', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0157', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0163', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0163', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0163', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0163', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0163', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0164', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0164', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0164', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0164', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0164', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0181', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0181', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0181', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0181', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0181', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0182', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0182', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0182', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0182', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0182', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0188', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0188', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0188', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0188', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0188', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0189', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0189', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0189', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0189', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_0189', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_020', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_020', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_020', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_020', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_020', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_021', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_021', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_021', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_021', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_021', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_024', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_024', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_024', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_024', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_024', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_025', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_025', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_025', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_025', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_025', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_026', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_026', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_026', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_026', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_026', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_027', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_027', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_027', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_027', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_027', 'water', '800', 'ml', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_029', 'tofu_silken', '1', '丁', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_029', 'veg_green_onion', '1', '本', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_029', 'seasoning_miso', '大さじ2', '大さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_029', 'dashi_powder', '小さじ1', '小さじ', 0);
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('soup_029', 'water', '800', 'ml', 0);

-- 合計 728 件の食材データを生成しました
