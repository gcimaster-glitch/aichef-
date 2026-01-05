-- ========================================
-- 食材マスタデータ（100レシピ対応）
-- ========================================

INSERT INTO ingredients (ingredient_id, name, category, default_unit) VALUES
-- 肉類
('meat_chicken', '鶏肉', 'meat_fish', 'g'),
('meat_pork', '豚肉', 'meat_fish', 'g'),
('meat_beef', '牛肉', 'meat_fish', 'g'),
('meat_ground_beef', '牛挽肉', 'meat_fish', 'g'),
('meat_ground_pork', '豚挽肉', 'meat_fish', 'g'),
('meat_ground_mix', '合挽肉', 'meat_fish', 'g'),
('meat_bacon', 'ベーコン', 'meat_fish', 'g'),
('meat_ham', 'ハム', 'meat_fish', 'g'),
('meat_sausage', 'ソーセージ', 'meat_fish', '本'),

-- 魚介類
('fish_salmon', '鮭', 'meat_fish', '切れ'),
('fish_mackerel', 'サバ', 'meat_fish', '切れ'),
('fish_yellowtail', 'ブリ', 'meat_fish', '切れ'),
('fish_saury', 'サンマ', 'meat_fish', '尾'),
('fish_horse_mackerel', 'アジ', 'meat_fish', '尾'),
('fish_white', '白身魚', 'meat_fish', '切れ'),
('fish_cod', 'タラ', 'meat_fish', '切れ'),
('seafood_shrimp', 'エビ', 'meat_fish', '尾'),
('seafood_squid', 'イカ', 'meat_fish', 'g'),
('seafood_clam', 'あさり', 'meat_fish', 'g'),
('seafood_shijimi', 'しじみ', 'meat_fish', 'g'),

-- 野菜類
('veg_onion', '玉ねぎ', 'vegetables', '個'),
('veg_carrot', '人参', 'vegetables', '本'),
('veg_potato', 'じゃがいも', 'vegetables', '個'),
('veg_sweet_potato', 'さつまいも', 'vegetables', '本'),
('veg_cabbage', 'キャベツ', 'vegetables', '枚'),
('veg_napa_cabbage', '白菜', 'vegetables', '枚'),
('veg_lettuce', 'レタス', 'vegetables', '枚'),
('veg_spinach', 'ほうれん草', 'vegetables', '束'),
('veg_komatsuna', '小松菜', 'vegetables', '束'),
('veg_broccoli', 'ブロッコリー', 'vegetables', '個'),
('veg_cauliflower', 'カリフラワー', 'vegetables', '個'),
('veg_asparagus', 'アスパラガス', 'vegetables', '本'),
('veg_green_bean', 'いんげん', 'vegetables', 'g'),
('veg_green_pepper', 'ピーマン', 'vegetables', '個'),
('veg_red_pepper', 'パプリカ', 'vegetables', '個'),
('veg_tomato', 'トマト', 'vegetables', '個'),
('veg_cucumber', 'きゅうり', 'vegetables', '本'),
('veg_eggplant', '茄子', 'vegetables', '本'),
('veg_daikon', '大根', 'vegetables', 'cm'),
('veg_burdock', 'ごぼう', 'vegetables', '本'),
('veg_lotus_root', 'レンコン', 'vegetables', 'g'),
('veg_taro', '里芋', 'vegetables', '個'),
('veg_pumpkin', 'かぼちゃ', 'vegetables', 'g'),
('veg_zucchini', 'ズッキーニ', 'vegetables', '本'),
('veg_corn', 'とうもろこし', 'vegetables', '本'),
('veg_edamame', '枝豆', 'vegetables', 'g'),
('veg_moyashi', 'もやし', 'vegetables', '袋'),
('veg_bean_sprout', '豆苗', 'vegetables', '袋'),

-- きのこ類
('veg_mushroom', 'しいたけ', 'vegetables', '個'),
('veg_enoki', 'えのき', 'vegetables', '袋'),
('veg_shimeji', 'しめじ', 'vegetables', '袋'),
('veg_maitake', 'まいたけ', 'vegetables', '袋'),

-- 豆腐・大豆製品
('tofu_silken', '絹豆腐', 'tofu_beans', '丁'),
('tofu_firm', '木綿豆腐', 'tofu_beans', '丁'),
('tofu_fried', '油揚げ', 'tofu_beans', '枚'),
('tofu_thick_fried', '厚揚げ', 'tofu_beans', '個'),
('soy_natto', '納豆', 'tofu_beans', 'パック'),
('soy_okara', 'おから', 'tofu_beans', 'g'),

-- 卵・乳製品
('egg', '卵', 'dairy_eggs', '個'),
('milk', '牛乳', 'dairy_eggs', 'ml'),
('butter', 'バター', 'dairy_eggs', 'g'),
('cheese', 'チーズ', 'dairy_eggs', 'g'),
('yogurt', 'ヨーグルト', 'dairy_eggs', 'g'),
('cream', '生クリーム', 'dairy_eggs', 'ml'),

-- 穀物・麺類
('grain_rice', '米', 'others', '合'),
('grain_bread', '食パン', 'others', '枚'),
('noodle_udon', 'うどん', 'others', '玉'),
('noodle_soba', 'そば', 'others', '束'),
('noodle_ramen', 'ラーメン', 'others', '玉'),
('noodle_pasta', 'パスタ', 'others', 'g'),
('noodle_somen', 'そうめん', 'others', '束'),
('noodle_harusame', '春雨', 'others', 'g'),
('grain_mochi', '餅', 'others', '個'),
('flour', '小麦粉', 'others', 'g'),
('bread_crumb', 'パン粉', 'others', 'g'),
('starch', '片栗粉', 'others', 'g'),

-- 調味料（基本）
('seasoning_salt', '塩', 'seasonings', 'g'),
('seasoning_sugar', '砂糖', 'seasonings', 'g'),
('seasoning_soy_sauce', '醤油', 'seasonings', 'ml'),
('seasoning_miso', '味噌', 'seasonings', 'g'),
('seasoning_mirin', 'みりん', 'seasonings', 'ml'),
('seasoning_sake', '酒', 'seasonings', 'ml'),
('seasoning_vinegar', '酢', 'seasonings', 'ml'),
('seasoning_rice_vinegar', '米酢', 'seasonings', 'ml'),
('oil_vegetable', 'サラダ油', 'seasonings', 'ml'),
('oil_sesame', 'ごま油', 'seasonings', 'ml'),
('oil_olive', 'オリーブオイル', 'seasonings', 'ml'),

-- 調味料（洋食）
('seasoning_ketchup', 'ケチャップ', 'seasonings', 'ml'),
('seasoning_worcester', 'ウスターソース', 'seasonings', 'ml'),
('seasoning_tonkatsu', 'とんかつソース', 'seasonings', 'ml'),
('seasoning_mayonnaise', 'マヨネーズ', 'seasonings', 'ml'),
('seasoning_mustard', 'マスタード', 'seasonings', 'g'),
('seasoning_pepper', '胡椒', 'seasonings', 'g'),
('seasoning_consomme', 'コンソメ', 'seasonings', '個'),
('seasoning_bouillon', 'ブイヨン', 'seasonings', '個'),

-- 調味料（中華・アジア）
('seasoning_oyster', 'オイスターソース', 'seasonings', 'ml'),
('seasoning_chicken_stock', '鶏ガラスープの素', 'seasonings', 'g'),
('seasoning_doubanjiang', '豆板醤', 'seasonings', 'g'),
('seasoning_gochujang', 'コチュジャン', 'seasonings', 'g'),
('seasoning_chili_oil', 'ラー油', 'seasonings', 'ml'),

-- 香味野菜・香辛料
('spice_ginger', '生姜', 'seasonings', 'g'),
('spice_garlic', 'にんにく', 'seasonings', '片'),
('spice_green_onion', '長ネギ', 'seasonings', '本'),
('spice_shiso', '大葉', 'seasonings', '枚'),
('spice_sesame_white', '白ごま', 'seasonings', 'g'),
('spice_sesame_black', '黒ごま', 'seasonings', 'g'),
('spice_nori', '海苔', 'seasonings', '枚'),

-- だし・海藻
('dashi_kombu', '昆布', 'seasonings', 'g'),
('dashi_bonito', 'かつお節', 'seasonings', 'g'),
('dashi_powder', 'だしの素', 'seasonings', 'g'),
('seaweed_wakame', 'わかめ', 'vegetables', 'g'),
('seaweed_hijiki', 'ひじき', 'vegetables', 'g'),
('seaweed_nori_sheet', '焼き海苔', 'seasonings', '枚'),

-- 漬物・加工品
('pickle_kimchi', 'キムチ', 'others', 'g'),
('pickle_takuan', 'たくあん', 'others', 'g'),
('pickle_umeboshi', '梅干し', 'others', '個'),
('canned_tuna', 'ツナ缶', 'others', '缶'),
('canned_corn', 'コーン缶', 'others', '缶'),
('canned_tomato', 'トマト缶', 'others', '缶'),

-- その他
('curry_roux', 'カレールー', 'seasonings', 'g'),
('stew_roux', 'シチューの素', 'seasonings', 'g'),
('hayashi_roux', 'ハヤシルー', 'seasonings', 'g'),
('water', '水', 'others', 'ml'),
('ice', '氷', 'others', '個');
