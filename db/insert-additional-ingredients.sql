-- 300件レシピに必要な追加材料マスタ
-- 生成日時: 2026-01-16

PRAGMA foreign_keys = OFF;

-- 野菜類追加
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_eggplant', '茄子', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bean_sprouts', 'もやし', 'vegetables', '袋');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_broccoli', 'ブロッコリー', 'vegetables', '株');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_asparagus', 'アスパラガス', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_green_beans', 'いんげん', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_okra', 'オクラ', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_zucchini', 'ズッキーニ', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_paprika', 'パプリカ', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_radish', 'ラディッシュ', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bitter_melon', 'ゴーヤ', 'vegetables', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chinese_cabbage', '白菜', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_komatsuna', '小松菜', 'vegetables', '束');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_napa_cabbage', '菜の花', 'vegetables', '束');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_lotus_root', 'れんこん', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_bamboo_shoot', 'たけのこ', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mountain_vegetables', '山菜', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_taro', '里芋', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_sweet_potato', 'さつまいも', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_yam', '長芋', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mushroom', 'きのこ', 'vegetables', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_shiitake', 'しいたけ', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_enoki', 'えのき', 'vegetables', '袋');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_shimeji', 'しめじ', 'vegetables', '袋');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_avocado', 'アボカド', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_tomato', 'トマト', 'vegetables', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_cherry_tomato', 'ミニトマト', 'vegetables', '個');

-- 魚介類追加
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_yellowtail', 'ぶり', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_horse_mackerel', '鯵', 'meat_fish', '尾');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_white_fish', '白身魚', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_flounder', 'カレイ', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_cod', '鱈', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_red_snapper', '金目鯛', 'meat_fish', '切れ');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mackerel_can', '鯖缶', 'meat_fish', '缶');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_tuna_can', 'ツナ缶', 'meat_fish', '缶');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_salmon_flakes', '鮭フレーク', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_squid', 'イカ', 'meat_fish', '杯');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_octopus', 'タコ', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_clam', 'あさり', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_shellfish', '貝', 'meat_fish', 'g');

-- 肉類追加
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_spare_ribs', 'スペアリブ', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken_wings', '手羽先', 'meat_fish', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken_drumstick', '手羽元', 'meat_fish', '本');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken_liver', '鶏レバー', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chicken_gizzard', '砂肝', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_beef_tongue', '牛タン', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_meat', '肉', 'meat_fish', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ground_meat', 'ひき肉', 'meat_fish', 'g');

-- 調味料追加
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_olive_oil', 'オリーブオイル', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_chili_oil', 'ラー油', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ponzu', 'ポン酢', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_mustard', 'マスタード', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_honey', 'はちみつ', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_sesame_paste', 'ごまペースト', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_herbs', 'ハーブ', 'seasonings', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_red_wine', '赤ワイン', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_white_wine', '白ワイン', 'seasonings', 'ml');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_salt_kelp', '塩昆布', 'seasonings', 'g');

-- その他
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pasta', 'パスタ', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_udon', 'うどん', 'others', '玉');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_soba', 'そば', 'others', '束');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_somen', 'そうめん', 'others', '束');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_yakisoba_noodles', '焼きそば麺', 'others', '袋');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ramen_noodles', 'ラーメン', 'others', '袋');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_glass_noodles', '春雨', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_vermicelli', 'ビーフン', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pineapple', 'パイナップル', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_edamame', '枝豆', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_pickles', '漬物', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_konjac', 'こんにゃく', 'others', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_soybean', '大豆', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_ganmodoki', 'がんもどき', 'others', '個');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_koya_tofu', '高野豆腐', 'others', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_atsuage', '厚揚げ', 'others', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_vegetable', '野菜', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_seaweed', '海藻', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_nori', '海苔', 'others', '枚');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_aosa', 'あおさ', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_junsai', 'じゅんさい', 'others', 'g');
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES ('ing_moroheiya', 'モロヘイヤ', 'others', '束');

PRAGMA foreign_keys = ON;

-- 確認
SELECT category, COUNT(*) as count FROM ingredients GROUP BY category;
