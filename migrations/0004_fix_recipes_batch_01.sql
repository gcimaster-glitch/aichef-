-- Phase 2: レシピデータ修正（最初の10件）
-- 無効化されていたレシピを正しいデータで修正し、有効化

-- 1. 小松菜のおひたし (side_011)
UPDATE recipes 
SET steps_json = '["小松菜は根元を切り落とし、5cm幅に切る。","沸騰したお湯で小松菜を1分茹で、冷水にとって水気を絞る。","ボウルに醤油とだしを混ぜ、小松菜を和える。","器に盛り、かつお節をかけて完成。"]',
    is_active = 1
WHERE recipe_id = 'side_011';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_011';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_011', 'ing_komatsuna', 200, 'g', 0),
('side_011', 'ing_soy_sauce', 15, 'ml', 0),
('side_011', 'ing_dashi', 30, 'ml', 0),
('side_011', 'ing_katsuobushi', 3, 'g', 0);

-- 2. 白菜の浅漬け (side_012)
UPDATE recipes 
SET steps_json = '["白菜は一口大のざく切りにする。","ボウルに白菜、塩、昆布、千切りにした生姜を入れて混ぜる。","重しをして冷蔵庫で2時間以上漬ける。","水気を軽く絞って器に盛り完成。"]',
    is_active = 1
WHERE recipe_id = 'side_012';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_012';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_012', 'ing_napa_cabbage', 300, 'g', 0),
('side_012', 'ing_salt', 6, 'g', 0),
('side_012', 'ing_kombu', 5, 'g', 0),
('side_012', 'ing_ginger', 10, 'g', 0);

-- 3. なすの煮浸し (side_013)
UPDATE recipes 
SET steps_json = '["なすはヘタを取り、縦半分に切ってから斜め切りにする。","鍋に油を熱し、なすを焼き色がつくまで炒める。","だし、醤油、みりん、千切り生姜を加えて中火で10分煮る。","火を止めて粗熱を取り、器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_013';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_013';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_013', 'ing_eggplant', 3, '本', 0),
('side_013', 'ing_dashi', 300, 'ml', 0),
('side_013', 'ing_soy_sauce', 30, 'ml', 0),
('side_013', 'ing_mirin', 30, 'ml', 0),
('side_013', 'ing_ginger', 10, 'g', 0);

-- 4. 里芋の煮っころがし (side_014)
UPDATE recipes 
SET steps_json = '["里芋は皮をむいて一口大に切り、水にさらす。","鍋に里芋とだしを入れて中火で10分煮る。","醤油、砂糖、みりんを加えて落し蓋をし、15分煮る。","火を止めて5分蒸らし、器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_014';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_014';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_014', 'ing_taro', 400, 'g', 0),
('side_014', 'ing_dashi', 200, 'ml', 0),
('side_014', 'ing_soy_sauce', 30, 'ml', 0),
('side_014', 'ing_sugar', 20, 'g', 0),
('side_014', 'ing_mirin', 30, 'ml', 0);

-- 5. 筑前煮 (side_015)
UPDATE recipes 
SET steps_json = '["鶏肉は一口大に切る。野菜は乱切り、こんにゃくは手でちぎる。","鍋に油を熱し、鶏肉を炒める。色が変わったら野菜を加える。","だし、醤油、砂糖、みりんを加えて落し蓋をし、20分煮る。","火を止めて5分蒸らし、器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_015';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_015';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_015', 'ing_chicken_thigh', 200, 'g', 0),
('side_015', 'ing_lotus_root', 100, 'g', 0),
('side_015', 'ing_burdock', 100, 'g', 0),
('side_015', 'ing_carrot', 80, 'g', 0),
('side_015', 'ing_konnyaku', 100, 'g', 0),
('side_015', 'ing_dashi', 300, 'ml', 0),
('side_015', 'ing_soy_sauce', 45, 'ml', 0),
('side_015', 'ing_sugar', 20, 'g', 0),
('side_015', 'ing_mirin', 45, 'ml', 0);

-- 6. がんもどきの煮物 (side_016)
UPDATE recipes 
SET steps_json = '["がんもどきは熱湯をかけて油抜きをする。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","がんもどきを加えて落し蓋をし、中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_016';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_016';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_016', 'ing_ganmodoki', 4, '個', 0),
('side_016', 'ing_dashi', 300, 'ml', 0),
('side_016', 'ing_soy_sauce', 30, 'ml', 0),
('side_016', 'ing_mirin', 30, 'ml', 0),
('side_016', 'ing_sugar', 15, 'g', 0);

-- 7. こんにゃくの煮物 (side_017)
UPDATE recipes 
SET steps_json = '["こんにゃくは手でちぎり、熱湯で2分茹でてアク抜きをする。","鍋にだし、醤油、みりん、砂糖、赤唐辛子を入れて煮立てる。","こんにゃくを加えて中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_017';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_017';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_017', 'ing_konnyaku', 300, 'g', 0),
('side_017', 'ing_dashi', 200, 'ml', 0),
('side_017', 'ing_soy_sauce', 30, 'ml', 0),
('side_017', 'ing_mirin', 30, 'ml', 0),
('side_017', 'ing_sugar', 15, 'g', 0),
('side_017', 'ing_red_chili', 1, '本', 0);

-- 8. 大豆の煮物 (side_018)
UPDATE recipes 
SET steps_json = '["大豆は水気を切る。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","大豆を加えて落し蓋をし、中火で20分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_018';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_018';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_018', 'ing_soybean', 200, 'g', 0),
('side_018', 'ing_dashi', 200, 'ml', 0),
('side_018', 'ing_soy_sauce', 30, 'ml', 0),
('side_018', 'ing_mirin', 30, 'ml', 0),
('side_018', 'ing_sugar', 20, 'g', 0);

-- 9. レンコンのきんぴら (side_019)
UPDATE recipes 
SET steps_json = '["れんこんは薄切りにして酢水にさらす。にんじんは細切りにする。","フライパンにごま油を熱し、水気を切ったれんこんとにんじんを炒める。","醤油、砂糖、みりん、赤唐辛子を加えて汁気がなくなるまで炒める。","器に盛って完成。"]',
    is_active = 1
WHERE recipe_id = 'side_019';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_019';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_019', 'ing_lotus_root', 200, 'g', 0),
('side_019', 'ing_carrot', 50, 'g', 0),
('side_019', 'ing_soy_sauce', 20, 'ml', 0),
('side_019', 'ing_sugar', 15, 'g', 0),
('side_019', 'ing_mirin', 15, 'ml', 0),
('side_019', 'ing_sesame_oil', 10, 'ml', 0),
('side_019', 'ing_red_chili', 1, '本', 0);

-- 10. もやしナムル (side_020)
UPDATE recipes 
SET steps_json = '["もやしは洗って水気を切る。","沸騰したお湯でもやしを1分茹で、ザルにあげて水気を切る。","ボウルにごま油、塩、すりおろしたにんにくを混ぜる。","もやしを加えて和え、白ごまをかけて完成。"]',
    is_active = 1
WHERE recipe_id = 'side_020';

DELETE FROM recipe_ingredients WHERE recipe_id = 'side_020';
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
('side_020', 'ing_bean_sprouts', 200, 'g', 0),
('side_020', 'ing_sesame_oil', 15, 'ml', 0),
('side_020', 'ing_salt', 3, 'g', 0),
('side_020', 'ing_garlic', 5, 'g', 0),
('side_020', 'ing_white_sesame', 5, 'g', 0);
