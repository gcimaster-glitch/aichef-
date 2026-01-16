-- AI Chefs 正確な50件のレシピデータ
-- 生成日時: 2026-01-16T12:36:55.550Z

-- 1. 肉じゃが
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_001',
  '肉じゃが',
  '定番の家庭料理。豚肉・じゃがいも・玉ねぎを甘辛く煮込んだ和食の代表格。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  10,
  85,
  'pork',
  '["豚肉は一口大に切る。じゃがいもは皮をむいて一口大に、玉ねぎはくし切り、にんじんは乱切りにする。","鍋に油を熱し、豚肉を炒める。色が変わったら野菜を加えて炒める。","だし汁、砂糖、醤油、みりん、酒を加え、落し蓋をして中火で20分煮る。","じゃがいもが柔らかくなったら火を止め、5分蒸らして完成。"]',
  '["豚肉→牛肉","じゃがいも→さつまいも"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_potato', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_carrot', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_soy_sauce', 45, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_mirin', 45, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_sake', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_sugar', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_001', 'ing_dashi', 300, 'ml');

-- 2. カレーライス
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_002',
  'カレーライス',
  'みんな大好きカレー。野菜たっぷりで栄養満点。',
  'main',
  'western',
  'easy',
  45,
  1500,
  10,
  95,
  'pork',
  '["豚肉は一口大、玉ねぎはくし切り、にんじん・じゃがいもは乱切りにする。","鍋に油を熱し、豚肉と玉ねぎを炒める。","にんじん・じゃがいもを加え、水を入れて20分煮る。","いったん火を止め、カレールウを割り入れて溶かす。再び弱火で10分煮込む。"]',
  '["豚肉→鶏肉・牛肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_pork', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_onion', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_carrot', 2, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_potato', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_curry_roux', 1, '箱');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_oil', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_002', 'ing_water', 800, 'ml');

-- 3. ハンバーグ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_003',
  'ハンバーグ',
  'ジューシーな手作りハンバーグ。デミグラスソースで本格的な味わい。',
  'main',
  'western',
  'normal',
  40,
  1500,
  10,
  90,
  'beef',
  '["玉ねぎをみじん切りにして炒め、冷ます。パン粉に牛乳を染み込ませる。","ボウルに挽肉、玉ねぎ、パン粉、卵、塩・胡椒・ナツメグを入れてよく練る。","4等分にして小判型に整え、中央をくぼませる。","フライパンに油を熱し、強火で両面に焼き色をつけ、蓋をして弱火で10分蒸し焼き。","ケチャップとウスターソースを混ぜてソースを作り、かけて完成。"]',
  '["合挽肉→牛ひき肉100%"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_ground_beef', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_egg', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_bread_crumbs', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_milk', 50, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_salt', 3, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_pepper', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_nutmeg', 1, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_oil', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_ketchup', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_003', 'ing_worcestershire', 30, 'ml');

-- 4. 唐揚げ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_004',
  '唐揚げ',
  '外はカリッと中はジューシー。定番の鶏の唐揚げ。',
  'main',
  'japanese',
  'easy',
  30,
  1000,
  10,
  95,
  'chicken',
  '["鶏肉は一口大に切る。生姜とにんにくはすりおろす。","ボウルに鶏肉、醤油、酒、生姜、にんにくを入れて15分漬け込む。","片栗粉をまぶし、170度の油で5分揚げる。","いったん取り出して3分休ませ、180度で1分二度揚げしてカリッと仕上げる。"]',
  '["鶏もも肉→鶏むね肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_chicken_thigh', 400, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_garlic', 5, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_potato_starch', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_004', 'ing_oil', 500, 'ml');

-- 5. 鮭の塩焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_005',
  '鮭の塩焼き',
  'シンプルだけど美味しい。定番の和食。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  9,
  80,
  'fish',
  '["鮭の両面に塩を振り、15分置く。","グリルまたはフライパンで中火で両面を焼く（片面5分ずつ）。","レモンを添えて完成。"]',
  '["鮭→鯖・ぶり"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_005', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_005', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_005', 'ing_lemon', 0.5, '個');

-- 6. 麻婆豆腐
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_006',
  '麻婆豆腐',
  'ピリ辛で食欲をそそる中華の定番。',
  'main',
  'chinese',
  'normal',
  25,
  1000,
  9,
  60,
  'soy',
  '["豆腐は2cm角に切り、熱湯で下茹でする。長ねぎ・にんにく・生姜はみじん切り。","フライパンに油を熱し、にんにく・生姜・豆板醤を炒め、香りが出たら挽肉を炒める。","鶏ガラスープ、醤油、酒を加えて煮立たせ、豆腐を加える。","水溶き片栗粉でとろみをつけ、長ねぎとごま油を加えて完成。"]',
  '["豚ひき肉→牛ひき肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_ground_pork', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_leek', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_garlic', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_doubanjiang', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_sake', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_chicken_stock', 200, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_potato_starch', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_006', 'ing_sesame_oil', 10, 'ml');

-- 7. 生姜焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_007',
  '生姜焼き',
  '甘辛い生姜だれが食欲をそそる。ご飯が進む定番おかず。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  10,
  85,
  'pork',
  '["豚肉は食べやすい大きさに切る。玉ねぎは薄切り、生姜はすりおろす。","ボウルに醤油、みりん、酒、生姜を混ぜ合わせる。","フライパンに油を熱し、豚肉を炒める。","玉ねぎを加えて炒め、タレを加えて煮からめる。"]',
  '["豚肉→鶏肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_pork', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_ginger', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_mirin', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_007', 'ing_oil', 15, 'ml');

-- 8. 親子丼
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_008',
  '親子丼',
  '鶏肉と卵のハーモニー。やさしい味わいの丼もの。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  9,
  90,
  'chicken',
  '["鶏肉は一口大、玉ねぎは薄切りにする。","フライパンにだし汁、醤油、みりん、酒、砂糖を煮立て、鶏肉と玉ねぎを加える。","鶏肉に火が通ったら、溶き卵を回し入れ、半熟になったら火を止める。","ご飯の上に盛り付けて完成。"]',
  '["鶏もも肉→鶏むね肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_chicken_thigh', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_soy_sauce', 45, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_mirin', 45, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_sake', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_dashi', 150, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_008', 'ing_rice', 2, '杯');

-- 9. 豚キムチ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_009',
  '豚キムチ',
  'キムチの旨辛さが豚肉と相性抜群。',
  'main',
  'other',
  'easy',
  15,
  1000,
  8,
  50,
  'pork',
  '["豚肉は食べやすい大きさに切る。玉ねぎは薄切り、長ねぎは斜め切り。","フライパンにごま油を熱し、豚肉を炒める。","玉ねぎ・キムチ・長ねぎを加えて炒める。","醤油・酒・砂糖で味を調えて完成。"]',
  '["豚肉→牛肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_kimchi', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_onion', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_leek', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_sugar', 5, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_009', 'ing_sesame_oil', 10, 'ml');

-- 10. 焼き魚（さば）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_010',
  '焼き魚（さば）',
  '脂ののった鯖の塩焼き。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  8,
  70,
  'fish',
  '["鯖の両面に塩を振り、15分置く。","グリルで中火で両面を焼く（片面5分ずつ）。","レモンを添えて完成。"]',
  '["鯖→ぶり・鮭"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_010', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_010', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_010', 'ing_lemon', 0.5, '個');

-- 11. チンジャオロース
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_011',
  'チンジャオロース',
  '細切り牛肉とピーマンの中華炒め。',
  'main',
  'chinese',
  'normal',
  25,
  1500,
  8,
  65,
  'beef',
  '["牛肉・ピーマン・たけのこを細切りにする。","牛肉に醤油・酒・片栗粉で下味をつける。","フライパンに油を熱し、牛肉を炒めていったん取り出す。","ピーマン・たけのこを炒め、牛肉を戻し、オイスターソースで味付け。"]',
  '["牛肉→豚肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_beef', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_bell_pepper', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_bamboo_shoots', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_oyster_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_potato_starch', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_011', 'ing_oil', 30, 'ml');

-- 12. 餃子
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_012',
  '餃子',
  '手作り餃子。ジューシーな肉汁がたまらない。',
  'main',
  'chinese',
  'normal',
  45,
  1000,
  9,
  85,
  'pork',
  '["キャベツはみじん切りにして塩もみし、水気を絞る。長ねぎ・にんにく・生姜もみじん切り。","ボウルに挽肉と全材料を入れ、粘りが出るまで混ぜる。","餃子の皮で包む（30個）。","フライパンに油を熱し、餃子を並べて焼き、水を加えて蒸し焼きにする。"]',
  '["豚ひき肉→鶏ひき肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_ground_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_cabbage', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_leek', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_garlic', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_sesame_oil', 10, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_012', 'ing_gyoza_wrappers', 30, '枚');

-- 13. 回鍋肉（ホイコーロー）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_013',
  '回鍋肉（ホイコーロー）',
  '甘辛味噌だれが絶品の中華炒め。',
  'main',
  'chinese',
  'normal',
  25,
  1000,
  8,
  70,
  'pork',
  '["豚肉は薄切り、キャベツはざく切り、ピーマンは乱切り、長ねぎは斜め切り。","フライパンに油を熱し、にんにく・生姜・豆板醤を炒める。","豚肉を加えて炒め、野菜を加える。","味噌・酒・砂糖を混ぜたタレを加えて炒め合わせる。"]',
  '["豚肉→牛肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_cabbage', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_bell_pepper', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_leek', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_garlic', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_doubanjiang', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_miso', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_sugar', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_013', 'ing_oil', 30, 'ml');

-- 14. 鶏の照り焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_014',
  '鶏の照り焼き',
  '甘辛タレが絶品。お弁当にも最適。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  9,
  90,
  'chicken',
  '["鶏肉は一口大に切る。","ボウルに醤油・みりん・酒・砂糖を混ぜ合わせる。","フライパンに油を熱し、鶏肉の皮目から焼く。","両面に焼き色がついたらタレを加え、照りが出るまで煮詰める。"]',
  '["鶏もも肉→鶏むね肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_014', 'ing_chicken_thigh', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_014', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_014', 'ing_mirin', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_014', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_014', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_014', 'ing_oil', 15, 'ml');

-- 15. 豚汁
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_015',
  '豚汁',
  '具だくさんの味噌汁。ほっこり温まる一品。',
  'soup',
  'japanese',
  'easy',
  30,
  1000,
  9,
  85,
  'pork',
  '["豚肉は一口大、野菜は食べやすい大きさに切る。","鍋にごま油を熱し、豚肉を炒め、野菜を加えて炒める。","だし汁を加えて15分煮る。","豆腐を加え、火を止めて味噌を溶き入れる。長ねぎを散らして完成。"]',
  '["豚肉→鶏肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_pork', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_carrot', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_daikon', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_burdock', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_tofu', 0.5, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_leek', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_miso', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_dashi', 800, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_015', 'ing_sesame_oil', 10, 'ml');

-- 16. エビフライ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_016',
  'エビフライ',
  'サクサクの衣とプリプリのエビ。',
  'main',
  'western',
  'normal',
  30,
  1500,
  9,
  95,
  'fish',
  '["エビは殻をむき、背わたを取る。腹に切り込みを入れてまっすぐに伸ばす。","塩・胡椒で下味をつける。","小麦粉→溶き卵→パン粉の順につける。","170度の油で3分揚げる。タルタルソースを添えて完成。"]',
  '["エビ→白身魚"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_shrimp', 8, '尾');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_flour', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_egg', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_bread_crumbs', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_pepper', 1, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_oil', 500, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_016', 'ing_tartar_sauce', 50, 'g');

-- 17. とんかつ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_017',
  'とんかつ',
  'サクサクの衣とジューシーな豚肉。',
  'main',
  'japanese',
  'normal',
  35,
  1500,
  9,
  90,
  'pork',
  '["豚肉は筋切りし、塩・胡椒で下味をつける。","小麦粉→溶き卵→パン粉の順につける。","170度の油で片面3分ずつ揚げる。","食べやすい大きさに切り、とんかつソースをかけて完成。"]',
  '["豚ロース→豚ヒレ"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_pork_loin', 2, '枚');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_flour', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_egg', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_bread_crumbs', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_pepper', 1, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_oil', 500, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_017', 'ing_tonkatsu_sauce', 50, 'ml');

-- 18. 鯖の味噌煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_018',
  '鯖の味噌煮',
  '味噌だれが染み込んだ鯖が絶品。',
  'main',
  'japanese',
  'normal',
  30,
  1000,
  8,
  75,
  'fish',
  '["鯖は熱湯をかけて臭みを取る。生姜は薄切り。","鍋に水・酒・みりん・砂糖・生姜を煮立て、鯖を入れる。","落し蓋をして中火で15分煮る。","味噌を溶き入れ、さらに5分煮て完成。"]',
  '["鯖→ぶり"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_miso', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_sake', 50, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_mirin', 50, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_ginger', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_018', 'ing_water', 200, 'ml');

-- 19. 牛丼
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_019',
  '牛丼',
  '甘辛い牛肉が食欲をそそる。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  9,
  85,
  'beef',
  '["牛肉は食べやすい大きさに、玉ねぎは薄切りにする。","鍋にだし汁・醤油・みりん・酒・砂糖を煮立て、玉ねぎを入れる。","玉ねぎが柔らかくなったら牛肉を加え、アクを取りながら5分煮る。","ご飯の上に盛り付けて完成。"]',
  '["牛肉→豚肉"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_beef', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_soy_sauce', 45, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_mirin', 45, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_sake', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_dashi', 150, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_019', 'ing_rice', 2, '杯');

-- 20. オムライス
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_020',
  'オムライス',
  'ふわふわ卵とケチャップライスの定番洋食。',
  'main',
  'western',
  'normal',
  25,
  1000,
  9,
  95,
  'egg',
  '["鶏肉と玉ねぎはみじん切り。","フライパンにバターを熱し、鶏肉・玉ねぎを炒め、ご飯とケチャップを加えて炒める。","卵を溶き、塩・胡椒で味付け。フライパンにバターを熱して卵を流し、半熟で火を止める。","ケチャップライスを卵で包み、ケチャップをかけて完成。"]',
  '["鶏肉→ハム"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_rice', 2, '杯');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_chicken', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_onion', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_egg', 4, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_ketchup', 60, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_butter', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_020', 'ing_pepper', 1, 'g');

-- 21. きんぴらごぼう
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_001',
  'きんぴらごぼう',
  '食物繊維たっぷり。常備菜の定番。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  8,
  70,
  'other',
  '["ごぼうとにんじんを細切りにし、ごぼうは水にさらす。","フライパンにごま油を熱し、ごぼうとにんじんを炒める。","醤油・みりん・酒・砂糖を加えて炒め煮する。","水分が飛んだら、白ごまを振って完成。"]',
  '["ごぼう→れんこん"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_burdock', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_carrot', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_mirin', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_sugar', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_sesame_oil', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_001', 'ing_sesame_seeds', 5, 'g');

-- 22. ほうれん草のおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_002',
  'ほうれん草のおひたし',
  'シンプルだけど栄養満点の副菜。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  8,
  65,
  'other',
  '["ほうれん草は根元を切り落とし、よく洗う。","沸騰した湯で1分茹で、冷水にとって水気を絞る。","4cm長さに切り、醤油・みりん・だし汁で和える。","器に盛り、白ごまを振って完成。"]',
  '["ほうれん草→小松菜"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_002', 'ing_spinach', 1, '束');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_002', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_002', 'ing_mirin', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_002', 'ing_dashi', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_002', 'ing_sesame_seeds', 5, 'g');

-- 23. ポテトサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_003',
  'ポテトサラダ',
  'クリーミーで優しい味わい。子どもにも大人気。',
  'side',
  'western',
  'easy',
  20,
  500,
  9,
  90,
  'other',
  '["じゃがいもとにんじんは皮をむいて茹で、熱いうちに潰す。","きゅうりは薄切りにして塩もみし、水気を絞る。卵はゆで卵にして刻む。","ボウルに全材料を入れ、マヨネーズ・塩・胡椒で味を調える。","冷蔵庫で冷やして完成。"]',
  '["じゃがいも→さつまいも"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'ing_potato', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'ing_carrot', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'ing_cucumber', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'ing_egg', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'seasoning_mayo', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_003', 'ing_pepper', 1, 'g');

-- 24. かぼちゃの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_004',
  'かぼちゃの煮物',
  'ほっくり甘いかぼちゃの煮物。',
  'side',
  'japanese',
  'easy',
  25,
  500,
  8,
  80,
  'other',
  '["かぼちゃは種とワタを取り、一口大に切る。","鍋にだし汁・醤油・みりん・酒・砂糖を煮立て、かぼちゃを入れる。","落し蓋をして中火で20分煮る。","火を止めて5分蒸らして完成。"]',
  '["かぼちゃ→さつまいも"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_004', 'ing_pumpkin', 0.25, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_004', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_004', 'ing_mirin', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_004', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_004', 'ing_sugar', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_004', 'ing_dashi', 300, 'ml');

-- 25. 冷奴
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_005',
  '冷奴',
  'シンプルで涼しげ。薬味がアクセント。',
  'side',
  'japanese',
  'easy',
  5,
  300,
  7,
  60,
  'soy',
  '["豆腐を食べやすい大きさに切る。","長ねぎはみじん切り、生姜はすりおろす。","豆腐に薬味をのせ、醤油をかけ、かつお節を散らして完成。"]',
  '["絹ごし豆腐→木綿豆腐"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_005', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_005', 'ing_leek', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_005', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_005', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_005', 'ing_bonito_flakes', 3, 'g');

-- 26. ひじきの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_006',
  'ひじきの煮物',
  '鉄分たっぷりの健康副菜。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  7,
  70,
  'other',
  '["ひじきは水で戻す。にんじんは細切り、油揚げは短冊切り。","フライパンにごま油を熱し、にんじんと油揚げを炒める。","ひじきを加えて炒め、だし汁・醤油・みりん・酒・砂糖を加える。","煮汁が少なくなるまで煮て完成。"]',
  '["ひじき→切り干し大根"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_hijiki', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_carrot', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_aburaage', 1, '枚');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_mirin', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_dashi', 200, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_006', 'ing_sesame_oil', 15, 'ml');

-- 27. きゅうりの酢の物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_007',
  'きゅうりの酢の物',
  'さっぱりとした酢の物。箸休めに最適。',
  'side',
  'japanese',
  'easy',
  10,
  300,
  7,
  60,
  'other',
  '["きゅうりは薄切りにして塩もみし、水気を絞る。","わかめは水で戻す。","酢・砂糖・塩を混ぜた合わせ酢を作る。","きゅうりとわかめを合わせ酢で和え、白ごまを振って完成。"]',
  '["きゅうり→大根"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_007', 'ing_cucumber', 2, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_007', 'ing_wakame', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_007', 'ing_vinegar', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_007', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_007', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_007', 'ing_sesame_seeds', 5, 'g');

-- 28. 大根サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_008',
  '大根サラダ',
  'シャキシャキ食感が楽しい。',
  'side',
  'japanese',
  'easy',
  10,
  300,
  7,
  70,
  'other',
  '["大根は千切りにして水にさらす。レタスは食べやすい大きさにちぎる。","醤油・酢・ごま油・砂糖を混ぜてドレッシングを作る。","野菜を盛り付け、ドレッシングをかけて完成。"]',
  '["大根→キャベツ"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_008', 'ing_daikon', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_008', 'ing_lettuce', 0.25, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_008', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_008', 'ing_vinegar', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_008', 'ing_sesame_oil', 10, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_008', 'ing_sugar', 5, 'g');

-- 29. 切り干し大根の煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_009',
  '切り干し大根の煮物',
  '乾物の旨みが詰まった煮物。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  7,
  65,
  'other',
  '["切り干し大根は水で戻す。にんじんは細切り、油揚げは短冊切り。","鍋にだし汁・醤油・みりん・酒・砂糖を煮立て、切り干し大根・にんじん・油揚げを入れる。","落し蓋をして15分煮る。","火を止めて5分蒸らして完成。"]',
  '["切り干し大根→高野豆腐"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_dried_daikon', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_carrot', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_aburaage', 1, '枚');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_mirin', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_009', 'ing_dashi', 300, 'ml');

-- 30. 卵焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_010',
  '卵焼き',
  'お弁当の定番。甘めの味付けで子どもも大好き。',
  'side',
  'japanese',
  'easy',
  10,
  300,
  9,
  95,
  'egg',
  '["ボウルに卵を溶き、砂糖・醤油・みりんを加えて混ぜる。","卵焼き器に油を熱し、卵液を1/3流し入れる。","半熟になったら奥から手前に巻く。","残りの卵液も同様に巻いて完成。"]',
  '["砂糖→みりん多め"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_010', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_010', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_010', 'ing_soy_sauce', 10, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_010', 'ing_mirin', 10, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_010', 'ing_oil', 15, 'ml');

-- 31. 味噌汁（豆腐・わかめ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_001',
  '味噌汁（豆腐・わかめ）',
  '定番の組み合わせ。毎日飲みたい味噌汁。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  9,
  80,
  'soy',
  '["豆腐は1cm角に切る。わかめは水で戻す。","鍋にだし汁を煮立て、豆腐とわかめを入れる。","火を止めて味噌を溶き入れる。"]',
  '["豆腐→油揚げ"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_001', 'ing_tofu', 0.5, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_001', 'ing_wakame', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_001', 'ing_miso', 40, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_001', 'ing_dashi', 600, 'ml');

-- 32. コーンスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_002',
  'コーンスープ',
  'クリーミーで優しい味わい。子どもに大人気。',
  'soup',
  'western',
  'easy',
  15,
  500,
  9,
  95,
  'other',
  '["鍋にバターを熱し、コーンを炒める。","水とコンソメを加えて煮立て、牛乳を加える。","塩・胡椒で味を調えて完成。"]',
  '["缶詰コーン→冷凍コーン"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_canned_corn', 1, '缶');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_milk', 300, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_water', 200, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_butter', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_consomme', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_002', 'ing_pepper', 1, 'g');

-- 33. 中華スープ（卵・わかめ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_003',
  '中華スープ（卵・わかめ）',
  'あっさりした中華風スープ。',
  'soup',
  'chinese',
  'easy',
  10,
  300,
  8,
  80,
  'egg',
  '["わかめは水で戻す。長ねぎは小口切り。","鍋に鶏ガラスープを煮立て、醤油・塩で味付け。","溶き卵を回し入れ、わかめと長ねぎを加える。","ごま油を垂らして完成。"]',
  '["わかめ→豆腐"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_egg', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_wakame', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_leek', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_003', 'ing_sesame_oil', 5, 'ml');

-- 34. 野菜スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_004',
  '野菜スープ',
  '野菜たっぷりのヘルシースープ。',
  'soup',
  'western',
  'easy',
  20,
  500,
  8,
  80,
  'other',
  '["野菜は食べやすい大きさに切る。","鍋に水とコンソメを煮立て、野菜を入れる。","15分煮て、塩・胡椒で味を調えて完成。"]',
  '["キャベツ→白菜"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_carrot', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_cabbage', 0.25, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_potato', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_water', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_consomme', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_004', 'ing_pepper', 1, 'g');

-- 35. 味噌汁（なめこ・豆腐）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_005',
  '味噌汁（なめこ・豆腐）',
  'とろとろのなめこが美味しい。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  8,
  75,
  'soy',
  '["なめこはさっと洗う。豆腐は1cm角、長ねぎは小口切り。","鍋にだし汁を煮立て、なめこと豆腐を入れる。","火を止めて味噌を溶き入れ、長ねぎを散らして完成。"]',
  '["なめこ→えのき"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_005', 'ing_nameko', 1, 'パック');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_005', 'ing_tofu', 0.5, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_005', 'ing_leek', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_005', 'ing_miso', 40, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_005', 'ing_dashi', 600, 'ml');

-- 36. かき玉汁
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_006',
  'かき玉汁',
  'ふんわり卵の優しい味わい。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  8,
  85,
  'egg',
  '["長ねぎは小口切り。","鍋にだし汁・醤油・みりん・塩を煮立てる。","水溶き片栗粉でとろみをつける。","溶き卵を回し入れ、長ねぎを加えて完成。"]',
  '["卵→豆腐"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_egg', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_leek', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_potato_starch', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_mirin', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_006', 'ing_salt', 2, 'g');

-- 37. ミネストローネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_007',
  'ミネストローネ',
  'トマトベースの野菜たっぷりスープ。',
  'soup',
  'western',
  'easy',
  25,
  500,
  8,
  80,
  'other',
  '["野菜はすべて1cm角に切る。","鍋に油を熱し、野菜を炒める。","トマト缶・水・コンソメを加えて15分煮る。","塩・胡椒で味を調えて完成。"]',
  '["セロリ→ピーマン"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_carrot', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_celery', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_cabbage', 0.25, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_canned_tomato', 1, '缶');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_water', 400, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_consomme', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_pepper', 1, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_007', 'ing_oil', 15, 'ml');

-- 38. わかめスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_008',
  'わかめスープ',
  'シンプルで飽きのこない味。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  75,
  'other',
  '["わかめは水で戻す。長ねぎは小口切り。","鍋にだし汁・醤油・みりん・塩を煮立てる。","わかめと長ねぎを加え、白ごまを振って完成。"]',
  '["わかめ→もずく"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_wakame', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_leek', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_soy_sauce', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_mirin', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_008', 'ing_sesame_seeds', 3, 'g');

-- 39. けんちん汁
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_009',
  'けんちん汁',
  '根菜たっぷりの栄養満点汁物。',
  'soup',
  'japanese',
  'normal',
  30,
  500,
  7,
  75,
  'other',
  '["野菜はすべて食べやすい大きさに切る。","鍋にごま油を熱し、野菜を炒める。","だし汁・醤油・みりん・酒を加えて15分煮る。","豆腐と長ねぎを加え、さらに5分煮て完成。"]',
  '["ごぼう→れんこん"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_daikon', 0.25, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_carrot', 1, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_burdock', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_tofu', 0.5, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_leek', 0.5, '本');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_soy_sauce', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_mirin', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_sake', 15, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_dashi', 800, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_009', 'ing_sesame_oil', 10, 'ml');

-- 40. オニオンスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_010',
  'オニオンスープ',
  '玉ねぎの甘みが溶け込んだ洋風スープ。',
  'soup',
  'western',
  'easy',
  20,
  500,
  7,
  80,
  'other',
  '["玉ねぎは薄切りにする。","鍋にバターを熱し、玉ねぎを弱火で15分炒める（飴色になるまで）。","水とコンソメを加えて5分煮る。","塩・胡椒で味を調えて完成。"]',
  '["玉ねぎ→長ねぎ"]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_010', 'ing_onion', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_010', 'ing_butter', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_010', 'ing_water', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_010', 'ing_consomme', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_010', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_010', 'ing_pepper', 1, 'g');


-- 確認クエリ
SELECT 'recipes' as table_name, COUNT(*) as count FROM recipes
UNION ALL
SELECT 'recipe_ingredients', COUNT(*) FROM recipe_ingredients;

-- サンプルレシピの確認
SELECT r.recipe_id, r.title, r.role, COUNT(ri.ingredient_id) as ingredient_count
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
GROUP BY r.recipe_id, r.title, r.role
ORDER BY r.recipe_id
LIMIT 10;
