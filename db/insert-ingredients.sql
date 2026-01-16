-- AI Chefs 正確な50件のレシピに必要な材料データ
-- 生成日時: 2026-01-16

-- 外部キー制約を無効化（一時的）
PRAGMA foreign_keys = OFF;

-- 野菜類
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_potato', 'じゃがいも', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_onion', '玉ねぎ', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_carrot', 'にんじん', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_cabbage', 'キャベツ', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_leek', '長ねぎ', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bell_pepper', 'ピーマン', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_daikon', '大根', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_burdock', 'ごぼう', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_cucumber', 'きゅうり', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_lettuce', 'レタス', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pumpkin', 'かぼちゃ', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_spinach', 'ほうれん草', 'vegetables', '束');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_celery', 'セロリ', 'vegetables', '本');

-- 肉・魚類
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pork', '豚肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pork_loin', '豚ロース肉', 'meat_fish', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ground_pork', '豚ひき肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_beef', '牛肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ground_beef', '牛ひき肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken', '鶏肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken_thigh', '鶏もも肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_salmon', '鮭', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mackerel', '鯖', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_shrimp', 'エビ', 'meat_fish', '尾');

-- 卵・乳製品
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_egg', '卵', 'dairy_eggs', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_milk', '牛乳', 'dairy_eggs', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_butter', 'バター', 'dairy_eggs', 'g');

-- 豆腐・豆類
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_tofu', '豆腐', 'tofu_beans', '丁');

-- 調味料類
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_soy_sauce', '醤油', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mirin', 'みりん', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_sake', '酒', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_sugar', '砂糖', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_salt', '塩', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pepper', '胡椒', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_oil', '油', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_sesame_oil', 'ごま油', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_vinegar', '酢', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_miso', '味噌', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ketchup', 'ケチャップ', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_worcestershire', 'ウスターソース', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mayonnaise', 'マヨネーズ', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_curry_roux', 'カレールウ', 'seasonings', '箱');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ginger', '生姜', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_garlic', 'にんにく', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_doubanjiang', '豆板醤', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_oyster_sauce', 'オイスターソース', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_nutmeg', 'ナツメグ', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_tonkatsu_sauce', 'とんかつソース', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_tartar_sauce', 'タルタルソース', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_sesame_seeds', '白ごま', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mayo', 'マヨネーズ', 'seasonings', 'g');

-- その他
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_dashi', 'だし汁', 'others', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken_stock', '鶏ガラスープ', 'others', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_water', '水', 'others', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_rice', 'ご飯', 'others', '杯');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_flour', '小麦粉', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_potato_starch', '片栗粉', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bread_crumbs', 'パン粉', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_lemon', 'レモン', 'others', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_kimchi', 'キムチ', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bamboo_shoots', 'たけのこ', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_gyoza_wrappers', '餃子の皮', 'others', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bonito_flakes', 'かつお節', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_hijiki', '乾燥ひじき', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_aburaage', '油揚げ', 'others', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_wakame', 'わかめ', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_dried_daikon', '切り干し大根', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_canned_corn', 'コーン缶', 'others', '缶');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_consomme', 'コンソメ', 'others', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_nameko', 'なめこ', 'others', 'パック');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_canned_tomato', 'トマト缶', 'others', '缶');

-- 外部キー制約を再度有効化
PRAGMA foreign_keys = ON;

-- 確認
SELECT category, COUNT(*) as count FROM ingredients GROUP BY category;
