-- AI Chefs 正確な50件のレシピデータ
-- 生成日時: 2026-01-16T13:11:38.058Z

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

-- 41. 豚の生姜焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_021',
  '豚の生姜焼き',
  '豚の生姜焼きのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_021', 'ing_pork', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_021', 'ing_ginger', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_021', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_021', 'ing_mirin', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_021', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_021', 'ing_oil', 15, 'g');

-- 42. 豚バラ大根
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_022',
  '豚バラ大根',
  '豚バラ大根のレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_daikon', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_mirin', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_sake', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_sugar', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_022', 'ing_dashi', 300, 'g');

-- 43. 酢豚
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_023',
  '酢豚',
  '酢豚のレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_pork', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_bell_pepper', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_pineapple', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_ketchup', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_vinegar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_023', 'ing_potato_starch', 20, 'g');

-- 44. ポークソテー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_024',
  'ポークソテー',
  'ポークソテーのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_024', 'ing_pork_loin', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_024', 'ing_salt', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_024', 'ing_pepper', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_024', 'ing_flour', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_024', 'ing_butter', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_024', 'ing_soy_sauce', 15, 'g');

-- 45. 角煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_025',
  '角煮',
  '角煮のレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_pork', 400, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_ginger', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_leek', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_soy_sauce', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_mirin', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_sake', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_025', 'ing_water', 400, 'g');

-- 46. 豚しゃぶサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_026',
  '豚しゃぶサラダ',
  '豚しゃぶサラダのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_026', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_026', 'ing_lettuce', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_026', 'ing_cucumber', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_026', 'ing_sesame_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_026', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_026', 'ing_vinegar', 15, 'g');

-- 47. ポークカレー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_027',
  'ポークカレー',
  'ポークカレーのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_pork', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_onion', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_carrot', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_potato', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_curry_roux', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_027', 'ing_water', 800, 'g');

-- 48. 豚肉と茄子の味噌炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_028',
  '豚肉と茄子の味噌炒め',
  '豚肉と茄子の味噌炒めのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_eggplant', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_miso', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_mirin', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_sugar', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_028', 'ing_oil', 30, 'g');

-- 49. 豚肉のピカタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_029',
  '豚肉のピカタ',
  '豚肉のピカタのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_029', 'ing_pork_loin', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_029', 'ing_egg', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_029', 'ing_flour', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_029', 'ing_salt', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_029', 'ing_pepper', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_029', 'ing_oil', 30, 'g');

-- 50. 豚肉とキャベツの蒸し焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_030',
  '豚肉とキャベツの蒸し焼き',
  '豚肉とキャベツの蒸し焼きのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_030', 'ing_pork', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_030', 'ing_cabbage', 0.25, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_030', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_030', 'ing_sake', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_030', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_030', 'ing_mirin', 15, 'g');

-- 51. ポークケチャップ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_031',
  'ポークケチャップ',
  'ポークケチャップのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_031', 'ing_pork', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_031', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_031', 'ing_ketchup', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_031', 'ing_worcestershire', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_031', 'ing_sugar', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_031', 'ing_oil', 15, 'g');

-- 52. 豚肉の竜田揚げ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_032',
  '豚肉の竜田揚げ',
  '豚肉の竜田揚げのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_032', 'ing_pork', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_032', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_032', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_032', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_032', 'ing_potato_starch', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_032', 'ing_oil', 500, 'g');

-- 53. 豚バラもやし炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_033',
  '豚バラもやし炒め',
  '豚バラもやし炒めのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_033', 'ing_pork', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_033', 'ing_bean_sprouts', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_033', 'ing_leek', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_033', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_033', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_033', 'ing_sesame_oil', 15, 'g');

-- 54. 豚肉の甘酢あんかけ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_034',
  '豚肉の甘酢あんかけ',
  '豚肉の甘酢あんかけのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_pork', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_bell_pepper', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_vinegar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_ketchup', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_034', 'ing_potato_starch', 15, 'g');

-- 55. 豚肉とピーマンの味噌炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_035',
  '豚肉とピーマンの味噌炒め',
  '豚肉とピーマンの味噌炒めのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'pork',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_035', 'ing_pork', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_035', 'ing_bell_pepper', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_035', 'ing_miso', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_035', 'ing_mirin', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_035', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_035', 'ing_sugar', 10, 'g');

-- 56. チキンソテー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_036',
  'チキンソテー',
  'チキンソテーのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_036', 'ing_chicken_thigh', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_036', 'ing_salt', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_036', 'ing_pepper', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_036', 'ing_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_036', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_036', 'ing_butter', 10, 'g');

-- 57. 鶏の唐揚げ（甘辛）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_037',
  '鶏の唐揚げ（甘辛）',
  '鶏の唐揚げ（甘辛）のレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_chicken_thigh', 400, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_mirin', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_ginger', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_garlic', 5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_potato_starch', 50, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_037', 'ing_oil', 500, 'g');

-- 58. 鶏むね肉の南蛮漬け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_038',
  '鶏むね肉の南蛮漬け',
  '鶏むね肉の南蛮漬けのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_chicken', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_bell_pepper', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_vinegar', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_038', 'ing_potato_starch', 30, 'g');

-- 59. 鶏もも肉の塩焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_039',
  '鶏もも肉の塩焼き',
  '鶏もも肉の塩焼きのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_039', 'ing_chicken_thigh', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_039', 'ing_salt', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_039', 'ing_lemon', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_039', 'ing_oil', 15, 'g');

-- 60. 鶏肉のトマト煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_040',
  '鶏肉のトマト煮',
  '鶏肉のトマト煮のレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_chicken_thigh', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_canned_tomato', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_garlic', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_consomme', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_salt', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_040', 'ing_pepper', 1, '個');

-- 61. 鶏肉のクリーム煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_041',
  '鶏肉のクリーム煮',
  '鶏肉のクリーム煮のレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_chicken_thigh', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_mushroom', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_milk', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_flour', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_butter', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_041', 'ing_consomme', 1, '個');

-- 62. チキンカレー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_042',
  'チキンカレー',
  'チキンカレーのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_chicken_thigh', 400, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_onion', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_carrot', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_potato', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_curry_roux', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_042', 'ing_water', 600, 'g');

-- 63. 鶏肉のねぎ塩焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_043',
  '鶏肉のねぎ塩焼き',
  '鶏肉のねぎ塩焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_043', 'ing_chicken_thigh', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_043', 'ing_leek', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_043', 'ing_salt', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_043', 'ing_lemon', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_043', 'ing_sesame_oil', 15, 'g');

-- 64. 鶏肉の甘酢炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_044',
  '鶏肉の甘酢炒め',
  '鶏肉の甘酢炒めのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_chicken_thigh', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_bell_pepper', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_vinegar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_ketchup', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_044', 'ing_soy_sauce', 15, 'g');

-- 65. よだれ鶏
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_045',
  'よだれ鶏',
  'よだれ鶏のレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_chicken', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_leek', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_vinegar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_sesame_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_chili_oil', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_045', 'ing_sugar', 10, 'g');

-- 66. 鶏肉の香草焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_046',
  '鶏肉の香草焼き',
  '鶏肉の香草焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_046', 'ing_chicken_thigh', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_046', 'ing_salt', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_046', 'ing_pepper', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_046', 'ing_herbs', 5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_046', 'ing_garlic', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_046', 'ing_oil', 30, 'g');

-- 67. 鶏もも肉のポン酢炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_047',
  '鶏もも肉のポン酢炒め',
  '鶏もも肉のポン酢炒めのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_047', 'ing_chicken_thigh', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_047', 'ing_cabbage', 0.25, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_047', 'ing_ponzu', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_047', 'ing_sugar', 10, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_047', 'ing_oil', 15, 'g');

-- 68. 鶏肉とブロッコリーの炒め物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_048',
  '鶏肉とブロッコリーの炒め物',
  '鶏肉とブロッコリーの炒め物のレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_048', 'ing_chicken_thigh', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_048', 'ing_broccoli', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_048', 'ing_oyster_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_048', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_048', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_048', 'ing_oil', 30, 'g');

-- 69. バンバンジー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_049',
  'バンバンジー',
  'バンバンジーのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  70,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_049', 'ing_chicken', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_049', 'ing_cucumber', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_049', 'ing_sesame_paste', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_049', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_049', 'ing_vinegar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_049', 'ing_sesame_oil', 15, 'g');

-- 70. 鶏肉のマスタード焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_050',
  '鶏肉のマスタード焼き',
  '鶏肉のマスタード焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  80,
  'chicken',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_050', 'ing_chicken_thigh', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_050', 'ing_mustard', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_050', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_050', 'ing_honey', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_050', 'ing_oil', 15, 'g');

-- 71. ビーフカレー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_051',
  'ビーフカレー',
  'ビーフカレーのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_beef', 400, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_onion', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_carrot', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_potato', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_curry_roux', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_051', 'ing_water', 800, 'g');

-- 72. ビーフシチュー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_052',
  'ビーフシチュー',
  'ビーフシチューのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_beef', 400, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_onion', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_carrot', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_potato', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_canned_tomato', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_red_wine', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_consomme', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_052', 'ing_butter', 30, 'g');

-- 73. 牛肉のしぐれ煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_053',
  '牛肉のしぐれ煮',
  '牛肉のしぐれ煮のレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_053', 'ing_beef', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_053', 'ing_ginger', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_053', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_053', 'ing_mirin', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_053', 'ing_sake', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_053', 'ing_sugar', 20, 'g');

-- 74. ビーフストロガノフ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_054',
  'ビーフストロガノフ',
  'ビーフストロガノフのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_beef', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_mushroom', 100, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_milk', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_ketchup', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_butter', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_054', 'ing_flour', 20, 'g');

-- 75. 牛肉とごぼうの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_055',
  '牛肉とごぼうの煮物',
  '牛肉とごぼうの煮物のレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  70,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_beef', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_burdock', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_mirin', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_sake', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_sugar', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_055', 'ing_dashi', 300, 'g');

-- 76. 牛肉のオイスター炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_056',
  '牛肉のオイスター炒め',
  '牛肉のオイスター炒めのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  80,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_beef', 250, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_bell_pepper', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_oyster_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_soy_sauce', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_sake', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_056', 'ing_oil', 30, 'g');

-- 77. プルコギ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_057',
  'プルコギ',
  'プルコギのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  70,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_beef', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_leek', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_sugar', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_sesame_oil', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_057', 'ing_garlic', 10, 'g');

-- 78. 肉豆腐
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_058',
  '肉豆腐',
  '肉豆腐のレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1000,
  8,
  80,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_beef', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_tofu', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_leek', 0.5, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_soy_sauce', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_mirin', 45, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_sake', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_sugar', 15, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_058', 'ing_dashi', 200, 'g');

-- 79. 牛肉のガーリックライス
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_059',
  '牛肉のガーリックライス',
  '牛肉のガーリックライスのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1000,
  9,
  70,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_beef', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_rice', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_garlic', 20, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_soy_sauce', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_butter', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_salt', 2, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_059', 'ing_pepper', 1, '個');

-- 80. 牛すき焼き風煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_060',
  '牛すき焼き風煮',
  '牛すき焼き風煮のレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1000,
  7,
  80,
  'beef',
  '["材料を準備し、下ごしらえをする。","フライパンまたは鍋で調理する。","調味料で味付けする。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_beef', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_tofu', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_leek', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_soy_sauce', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_mirin', 60, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_sake', 30, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_060', 'ing_sugar', 30, 'g');

-- 81. 鮭のムニエル
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_061',
  '鮭のムニエル',
  '鮭のムニエルのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  7,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_061', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_061', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_061', 'ing_oil', 15, 'ml');

-- 82. 鯖の竜田揚げ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_062',
  '鯖の竜田揚げ',
  '鯖の竜田揚げのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  8,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_062', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_062', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_062', 'ing_oil', 15, 'ml');

-- 83. ぶりの照り焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_063',
  'ぶりの照り焼き',
  'ぶりの照り焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  9,
  75,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_063', 'ing_yellowtail', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_063', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_063', 'ing_oil', 15, 'ml');

-- 84. 鯵の南蛮漬け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_064',
  '鯵の南蛮漬け',
  '鯵の南蛮漬けのレシピです。',
  'main',
  'japanese',
  'easy',
  30,
  1000,
  7,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_064', 'ing_horse_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_064', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_064', 'ing_oil', 15, 'ml');

-- 85. 白身魚のフライ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_065',
  '白身魚のフライ',
  '白身魚のフライのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  8,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_065', 'ing_white_fish', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_065', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_065', 'ing_oil', 15, 'ml');

-- 86. 鮭のホイル焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_066',
  '鮭のホイル焼き',
  '鮭のホイル焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  9,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_066', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_066', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_066', 'ing_oil', 15, 'ml');

-- 87. 鯖のカレー焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_067',
  '鯖のカレー焼き',
  '鯖のカレー焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  7,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_067', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_067', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_067', 'ing_oil', 15, 'ml');

-- 88. ぶり大根
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_068',
  'ぶり大根',
  'ぶり大根のレシピです。',
  'main',
  'japanese',
  'easy',
  40,
  1000,
  8,
  80,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_068', 'ing_yellowtail', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_068', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_068', 'ing_oil', 15, 'ml');

-- 89. 鮭のちゃんちゃん焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_069',
  '鮭のちゃんちゃん焼き',
  '鮭のちゃんちゃん焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  30,
  1000,
  9,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_069', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_069', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_069', 'ing_oil', 15, 'ml');

-- 90. カレイの煮付け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_070',
  'カレイの煮付け',
  'カレイの煮付けのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  7,
  80,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_070', 'ing_flounder', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_070', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_070', 'ing_oil', 15, 'ml');

-- 91. 鯖缶の味噌煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_071',
  '鯖缶の味噌煮',
  '鯖缶の味噌煮のレシピです。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  8,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_071', 'ing_mackerel_can', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_071', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_071', 'ing_oil', 15, 'ml');

-- 92. ツナの和風パスタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_072',
  'ツナの和風パスタ',
  'ツナの和風パスタのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  9,
  80,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_072', 'ing_tuna_can', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_072', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_072', 'ing_oil', 15, 'ml');

-- 93. 鮭フレークチャーハン
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_073',
  '鮭フレークチャーハン',
  '鮭フレークチャーハンのレシピです。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  7,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_073', 'ing_salmon_flakes', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_073', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_073', 'ing_oil', 15, 'ml');

-- 94. サーモンのマリネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_074',
  'サーモンのマリネ',
  'サーモンのマリネのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  8,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_074', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_074', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_074', 'ing_oil', 15, 'ml');

-- 95. 鯵の塩焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_075',
  '鯵の塩焼き',
  '鯵の塩焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  9,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_075', 'ing_horse_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_075', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_075', 'ing_oil', 15, 'ml');

-- 96. 金目鯛の煮付け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_076',
  '金目鯛の煮付け',
  '金目鯛の煮付けのレシピです。',
  'main',
  'japanese',
  'easy',
  30,
  1000,
  7,
  80,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_076', 'ing_red_snapper', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_076', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_076', 'ing_oil', 15, 'ml');

-- 97. 鰤の照り焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_077',
  '鰤の照り焼き',
  '鰤の照り焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  8,
  75,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_077', 'ing_yellowtail', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_077', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_077', 'ing_oil', 15, 'ml');

-- 98. 鯖の味噌煮（生姜風味）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_078',
  '鯖の味噌煮（生姜風味）',
  '鯖の味噌煮（生姜風味）のレシピです。',
  'main',
  'japanese',
  'easy',
  30,
  1000,
  9,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_078', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_078', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_078', 'ing_oil', 15, 'ml');

-- 99. 鮭のバター焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_079',
  '鮭のバター焼き',
  '鮭のバター焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  7,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_079', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_079', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_079', 'ing_oil', 15, 'ml');

-- 100. 白身魚の蒸し物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_080',
  '白身魚の蒸し物',
  '白身魚の蒸し物のレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  8,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_080', 'ing_white_fish', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_080', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_080', 'ing_oil', 15, 'ml');

-- 101. 鱈のホイル蒸し
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_081',
  '鱈のホイル蒸し',
  '鱈のホイル蒸しのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  9,
  75,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_081', 'ing_cod', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_081', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_081', 'ing_oil', 15, 'ml');

-- 102. 鯖の竜田揚げ（カレー風味）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_082',
  '鯖の竜田揚げ（カレー風味）',
  '鯖の竜田揚げ（カレー風味）のレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  7,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_082', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_082', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_082', 'ing_oil', 15, 'ml');

-- 103. 鮭のクリーム煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_083',
  '鮭のクリーム煮',
  '鮭のクリーム煮のレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  8,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_083', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_083', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_083', 'ing_oil', 15, 'ml');

-- 104. ぶりの塩焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_084',
  'ぶりの塩焼き',
  'ぶりの塩焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  9,
  80,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_084', 'ing_yellowtail', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_084', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_084', 'ing_oil', 15, 'ml');

-- 105. 鯵のなめろう
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_085',
  '鯵のなめろう',
  '鯵のなめろうのレシピです。',
  'main',
  'japanese',
  'easy',
  15,
  1000,
  7,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_085', 'ing_horse_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_085', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_085', 'ing_oil', 15, 'ml');

-- 106. 鮭の西京焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_086',
  '鮭の西京焼き',
  '鮭の西京焼きのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  8,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_086', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_086', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_086', 'ing_oil', 15, 'ml');

-- 107. カレイのムニエル
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_087',
  'カレイのムニエル',
  'カレイのムニエルのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  1000,
  9,
  75,
  'other',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_087', 'ing_flounder', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_087', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_087', 'ing_oil', 15, 'ml');

-- 108. 鯖のトマト煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_088',
  '鯖のトマト煮',
  '鯖のトマト煮のレシピです。',
  'main',
  'japanese',
  'easy',
  30,
  1000,
  7,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_088', 'ing_mackerel', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_088', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_088', 'ing_oil', 15, 'ml');

-- 109. 鮭のホイル焼き（味噌バター）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_089',
  '鮭のホイル焼き（味噌バター）',
  '鮭のホイル焼き（味噌バター）のレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  8,
  75,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_089', 'ing_salmon', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_089', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_089', 'ing_oil', 15, 'ml');

-- 110. 白身魚のあんかけ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_090',
  '白身魚のあんかけ',
  '白身魚のあんかけのレシピです。',
  'main',
  'japanese',
  'easy',
  25,
  1000,
  9,
  80,
  'fish',
  '["魚に下味をつける。","フライパンまたはグリルで焼く。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_090', 'ing_white_fish', 2, '切れ');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_090', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_090', 'ing_oil', 15, 'ml');

-- 111. オムレツ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_091',
  'オムレツ',
  'オムレツのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  7,
  80,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_091', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_091', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_091', 'ing_oil', 15, 'ml');

-- 112. スクランブルエッグ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_092',
  'スクランブルエッグ',
  'スクランブルエッグのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  8,
  85,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_092', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_092', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_092', 'ing_oil', 15, 'ml');

-- 113. 茶碗蒸し
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_093',
  '茶碗蒸し',
  '茶碗蒸しのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  9,
  80,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_093', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_093', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_093', 'ing_oil', 15, 'ml');

-- 114. だし巻き卵
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_094',
  'だし巻き卵',
  'だし巻き卵のレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  7,
  85,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_094', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_094', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_094', 'ing_oil', 15, 'ml');

-- 115. キッシュ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_095',
  'キッシュ',
  'キッシュのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  8,
  80,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_095', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_095', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_095', 'ing_oil', 15, 'ml');

-- 116. ニラ玉
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_096',
  'ニラ玉',
  'ニラ玉のレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  9,
  85,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_096', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_096', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_096', 'ing_oil', 15, 'ml');

-- 117. 卵とじうどん
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_097',
  '卵とじうどん',
  '卵とじうどんのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  7,
  80,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_097', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_097', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_097', 'ing_oil', 15, 'ml');

-- 118. カルボナーラ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_098',
  'カルボナーラ',
  'カルボナーラのレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  8,
  85,
  'egg',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_098', 'ing_egg', 3, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_098', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_098', 'ing_oil', 15, 'ml');

-- 119. 麻婆茄子
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_099',
  '麻婆茄子',
  '麻婆茄子のレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  9,
  80,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_099', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_099', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_099', 'ing_oil', 15, 'ml');

-- 120. 揚げ出し豆腐
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_100',
  '揚げ出し豆腐',
  '揚げ出し豆腐のレシピです。',
  'main',
  'japanese',
  'easy',
  20,
  800,
  7,
  85,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_100', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_100', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_100', 'ing_oil', 15, 'ml');

-- 121. 豆腐ハンバーグ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_101',
  '豆腐ハンバーグ',
  '豆腐ハンバーグのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  80,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_101', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_101', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_101', 'ing_oil', 15, 'ml');

-- 122. 豆腐ステーキ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_102',
  '豆腐ステーキ',
  '豆腐ステーキのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  9,
  85,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_102', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_102', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_102', 'ing_oil', 15, 'ml');

-- 123. 湯豆腐
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_103',
  '湯豆腐',
  '湯豆腐のレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  7,
  80,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_103', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_103', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_103', 'ing_oil', 15, 'ml');

-- 124. 豆腐チゲ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_104',
  '豆腐チゲ',
  '豆腐チゲのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  85,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_104', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_104', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_104', 'ing_oil', 15, 'ml');

-- 125. 豆腐の味噌田楽
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_105',
  '豆腐の味噌田楽',
  '豆腐の味噌田楽のレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  9,
  80,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_105', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_105', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_105', 'ing_oil', 15, 'ml');

-- 126. 高野豆腐の煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_106',
  '高野豆腐の煮物',
  '高野豆腐の煮物のレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  7,
  85,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_106', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_106', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_106', 'ing_oil', 15, 'ml');

-- 127. 厚揚げの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_107',
  '厚揚げの煮物',
  '厚揚げの煮物のレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  80,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_107', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_107', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_107', 'ing_oil', 15, 'ml');

-- 128. 厚揚げのネギ味噌かけ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_108',
  '厚揚げのネギ味噌かけ',
  '厚揚げのネギ味噌かけのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  9,
  85,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_108', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_108', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_108', 'ing_oil', 15, 'ml');

-- 129. 豆腐のあんかけ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_109',
  '豆腐のあんかけ',
  '豆腐のあんかけのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  7,
  80,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_109', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_109', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_109', 'ing_oil', 15, 'ml');

-- 130. 豆腐グラタン
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_110',
  '豆腐グラタン',
  '豆腐グラタンのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  85,
  'soy',
  '["材料を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_110', 'ing_tofu', 1, '丁');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_110', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_110', 'ing_oil', 15, 'ml');

-- 131. ミートソースパスタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_111',
  'ミートソースパスタ',
  'ミートソースパスタのレシピです。',
  'main',
  'western',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_111', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_111', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_111', 'ing_salt', 3, 'g');

-- 132. カルボナーラ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_112',
  'カルボナーラ',
  'カルボナーラのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_112', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_112', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_112', 'ing_salt', 3, 'g');

-- 133. ペペロンチーノ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_113',
  'ペペロンチーノ',
  'ペペロンチーノのレシピです。',
  'main',
  'western',
  'easy',
  25,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_113', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_113', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_113', 'ing_salt', 3, 'g');

-- 134. ナポリタン
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_114',
  'ナポリタン',
  'ナポリタンのレシピです。',
  'main',
  'western',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_114', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_114', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_114', 'ing_salt', 3, 'g');

-- 135. 和風きのこパスタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_115',
  '和風きのこパスタ',
  '和風きのこパスタのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_115', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_115', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_115', 'ing_salt', 3, 'g');

-- 136. 明太子パスタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_116',
  '明太子パスタ',
  '明太子パスタのレシピです。',
  'main',
  'western',
  'easy',
  25,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_116', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_116', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_116', 'ing_salt', 3, 'g');

-- 137. トマトソースパスタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_117',
  'トマトソースパスタ',
  'トマトソースパスタのレシピです。',
  'main',
  'western',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_117', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_117', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_117', 'ing_salt', 3, 'g');

-- 138. クリームパスタ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_118',
  'クリームパスタ',
  'クリームパスタのレシピです。',
  'main',
  'western',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_118', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_118', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_118', 'ing_salt', 3, 'g');

-- 139. ジェノベーゼ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_119',
  'ジェノベーゼ',
  'ジェノベーゼのレシピです。',
  'main',
  'western',
  'easy',
  25,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_119', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_119', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_119', 'ing_salt', 3, 'g');

-- 140. ボンゴレビアンコ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_120',
  'ボンゴレビアンコ',
  'ボンゴレビアンコのレシピです。',
  'main',
  'western',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_120', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_120', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_120', 'ing_salt', 3, 'g');

-- 141. 焼きそば
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_121',
  '焼きそば',
  '焼きそばのレシピです。',
  'main',
  'other',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_121', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_121', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_121', 'ing_salt', 3, 'g');

-- 142. 焼うどん
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_122',
  '焼うどん',
  '焼うどんのレシピです。',
  'main',
  'other',
  'easy',
  25,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_122', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_122', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_122', 'ing_salt', 3, 'g');

-- 143. 皿うどん
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_123',
  '皿うどん',
  '皿うどんのレシピです。',
  'main',
  'other',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_123', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_123', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_123', 'ing_salt', 3, 'g');

-- 144. あんかけ焼きそば
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_124',
  'あんかけ焼きそば',
  'あんかけ焼きそばのレシピです。',
  'main',
  'other',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_124', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_124', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_124', 'ing_salt', 3, 'g');

-- 145. 焼きビーフン
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_125',
  '焼きビーフン',
  '焼きビーフンのレシピです。',
  'main',
  'other',
  'easy',
  25,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_125', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_125', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_125', 'ing_salt', 3, 'g');

-- 146. 冷やし中華
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_126',
  '冷やし中華',
  '冷やし中華のレシピです。',
  'main',
  'other',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_126', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_126', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_126', 'ing_salt', 3, 'g');

-- 147. 冷麺
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_127',
  '冷麺',
  '冷麺のレシピです。',
  'main',
  'other',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_127', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_127', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_127', 'ing_salt', 3, 'g');

-- 148. そうめん
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_128',
  'そうめん',
  'そうめんのレシピです。',
  'main',
  'other',
  'easy',
  25,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_128', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_128', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_128', 'ing_salt', 3, 'g');

-- 149. ざるそば
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_129',
  'ざるそば',
  'ざるそばのレシピです。',
  'main',
  'other',
  'easy',
  15,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_129', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_129', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_129', 'ing_salt', 3, 'g');

-- 150. 天ぷらそば
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_130',
  '天ぷらそば',
  '天ぷらそばのレシピです。',
  'main',
  'other',
  'easy',
  20,
  800,
  8,
  85,
  'other',
  '["パスタを茹でる。","ソースを作る。","和えて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_130', 'ing_pasta', 200, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_130', 'ing_olive_oil', 30, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_130', 'ing_salt', 3, 'g');

-- 151. 小松菜のおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_011',
  '小松菜のおひたし',
  '小松菜のおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_011', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_011', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_011', 'ing_oil', 10, 'ml');

-- 152. 白菜の浅漬け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_012',
  '白菜の浅漬け',
  '白菜の浅漬けのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_012', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_012', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_012', 'ing_oil', 10, 'ml');

-- 153. なすの煮浸し
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_013',
  'なすの煮浸し',
  'なすの煮浸しのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_013', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_013', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_013', 'ing_oil', 10, 'ml');

-- 154. 里芋の煮っころがし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_014',
  '里芋の煮っころがし',
  '里芋の煮っころがしのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_014', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_014', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_014', 'ing_oil', 10, 'ml');

-- 155. 筑前煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_015',
  '筑前煮',
  '筑前煮のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_015', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_015', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_015', 'ing_oil', 10, 'ml');

-- 156. がんもどきの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_016',
  'がんもどきの煮物',
  'がんもどきの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_016', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_016', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_016', 'ing_oil', 10, 'ml');

-- 157. こんにゃくの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_017',
  'こんにゃくの煮物',
  'こんにゃくの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_017', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_017', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_017', 'ing_oil', 10, 'ml');

-- 158. 大豆の煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_018',
  '大豆の煮物',
  '大豆の煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_018', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_018', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_018', 'ing_oil', 10, 'ml');

-- 159. レンコンのきんぴら
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_019',
  'レンコンのきんぴら',
  'レンコンのきんぴらのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_019', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_019', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_019', 'ing_oil', 10, 'ml');

-- 160. もやしナムル
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_020',
  'もやしナムル',
  'もやしナムルのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_020', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_020', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_020', 'ing_oil', 10, 'ml');

-- 161. ブロッコリーのおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_021',
  'ブロッコリーのおひたし',
  'ブロッコリーのおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_021', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_021', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_021', 'ing_oil', 10, 'ml');

-- 162. アスパラのおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_022',
  'アスパラのおひたし',
  'アスパラのおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_022', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_022', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_022', 'ing_oil', 10, 'ml');

-- 163. いんげんの胡麻和え
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_023',
  'いんげんの胡麻和え',
  'いんげんの胡麻和えのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_023', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_023', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_023', 'ing_oil', 10, 'ml');

-- 164. オクラのおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_024',
  'オクラのおひたし',
  'オクラのおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_024', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_024', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_024', 'ing_oil', 10, 'ml');

-- 165. トマトのマリネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_025',
  'トマトのマリネ',
  'トマトのマリネのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_025', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_025', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_025', 'ing_oil', 10, 'ml');

-- 166. ピーマンのおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_026',
  'ピーマンのおひたし',
  'ピーマンのおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_026', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_026', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_026', 'ing_oil', 10, 'ml');

-- 167. 春雨サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_027',
  '春雨サラダ',
  '春雨サラダのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_027', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_027', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_027', 'ing_oil', 10, 'ml');

-- 168. マカロニサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_028',
  'マカロニサラダ',
  'マカロニサラダのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_028', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_028', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_028', 'ing_oil', 10, 'ml');

-- 169. コールスロー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_029',
  'コールスロー',
  'コールスローのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_029', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_029', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_029', 'ing_oil', 10, 'ml');

-- 170. シーザーサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_030',
  'シーザーサラダ',
  'シーザーサラダのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_030', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_030', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_030', 'ing_oil', 10, 'ml');

-- 171. 大根の煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_031',
  '大根の煮物',
  '大根の煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_031', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_031', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_031', 'ing_oil', 10, 'ml');

-- 172. かぶの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_032',
  'かぶの煮物',
  'かぶの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_032', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_032', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_032', 'ing_oil', 10, 'ml');

-- 173. じゃがいものそぼろ煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_033',
  'じゃがいものそぼろ煮',
  'じゃがいものそぼろ煮のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_033', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_033', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_033', 'ing_oil', 10, 'ml');

-- 174. さつまいもの甘煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_034',
  'さつまいもの甘煮',
  'さつまいもの甘煮のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_034', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_034', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_034', 'ing_oil', 10, 'ml');

-- 175. 枝豆
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_035',
  '枝豆',
  '枝豆のレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_035', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_035', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_035', 'ing_oil', 10, 'ml');

-- 176. 浅漬け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_036',
  '浅漬け',
  '浅漬けのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_036', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_036', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_036', 'ing_oil', 10, 'ml');

-- 177. 福神漬け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_037',
  '福神漬け',
  '福神漬けのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_037', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_037', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_037', 'ing_oil', 10, 'ml');

-- 178. らっきょう
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_038',
  'らっきょう',
  'らっきょうのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_038', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_038', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_038', 'ing_oil', 10, 'ml');

-- 179. 厚揚げの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_039',
  '厚揚げの煮物',
  '厚揚げの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_039', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_039', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_039', 'ing_oil', 10, 'ml');

-- 180. がんもの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_040',
  'がんもの煮物',
  'がんもの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_040', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_040', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_040', 'ing_oil', 10, 'ml');

-- 181. 油揚げの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_041',
  '油揚げの煮物',
  '油揚げの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_041', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_041', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_041', 'ing_oil', 10, 'ml');

-- 182. 高野豆腐の煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_042',
  '高野豆腐の煮物',
  '高野豆腐の煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'soy',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_042', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_042', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_042', 'ing_oil', 10, 'ml');

-- 183. ゆで卵
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_043',
  'ゆで卵',
  'ゆで卵のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'egg',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_043', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_043', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_043', 'ing_oil', 10, 'ml');

-- 184. 味付け卵
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_044',
  '味付け卵',
  '味付け卵のレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'egg',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_044', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_044', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_044', 'ing_oil', 10, 'ml');

-- 185. 温泉卵
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_045',
  '温泉卵',
  '温泉卵のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'egg',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_045', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_045', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_045', 'ing_oil', 10, 'ml');

-- 186. 卵サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_046',
  '卵サラダ',
  '卵サラダのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'egg',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_046', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_046', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_046', 'ing_oil', 10, 'ml');

-- 187. かぼちゃサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_047',
  'かぼちゃサラダ',
  'かぼちゃサラダのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_047', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_047', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_047', 'ing_oil', 10, 'ml');

-- 188. マッシュポテト
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_048',
  'マッシュポテト',
  'マッシュポテトのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_048', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_048', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_048', 'ing_oil', 10, 'ml');

-- 189. フライドポテト
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_049',
  'フライドポテト',
  'フライドポテトのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_049', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_049', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_049', 'ing_oil', 10, 'ml');

-- 190. ポテトグラタン
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_050',
  'ポテトグラタン',
  'ポテトグラタンのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_050', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_050', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_050', 'ing_oil', 10, 'ml');

-- 191. グリーンサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_051',
  'グリーンサラダ',
  'グリーンサラダのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_051', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_051', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_051', 'ing_oil', 10, 'ml');

-- 192. 海藻サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_052',
  '海藻サラダ',
  '海藻サラダのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_052', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_052', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_052', 'ing_oil', 10, 'ml');

-- 193. 豆腐サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_053',
  '豆腐サラダ',
  '豆腐サラダのレシピです。',
  'side',
  'western',
  'easy',
  10,
  500,
  6,
  70,
  'soy',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_053', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_053', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_053', 'ing_oil', 10, 'ml');

-- 194. アボカドサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_054',
  'アボカドサラダ',
  'アボカドサラダのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_054', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_054', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_054', 'ing_oil', 10, 'ml');

-- 195. トマトサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_055',
  'トマトサラダ',
  'トマトサラダのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_055', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_055', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_055', 'ing_oil', 10, 'ml');

-- 196. キャベツサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_056',
  'キャベツサラダ',
  'キャベツサラダのレシピです。',
  'side',
  'western',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_056', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_056', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_056', 'ing_oil', 10, 'ml');

-- 197. 人参サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_057',
  '人参サラダ',
  '人参サラダのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_057', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_057', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_057', 'ing_oil', 10, 'ml');

-- 198. 大根サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_058',
  '大根サラダ',
  '大根サラダのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_058', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_058', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_058', 'ing_oil', 10, 'ml');

-- 199. かぼちゃサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_059',
  'かぼちゃサラダ',
  'かぼちゃサラダのレシピです。',
  'side',
  'western',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_059', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_059', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_059', 'ing_oil', 10, 'ml');

-- 200. ブロッコリーサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_060',
  'ブロッコリーサラダ',
  'ブロッコリーサラダのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_060', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_060', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_060', 'ing_oil', 10, 'ml');

-- 201. カプレーゼ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_061',
  'カプレーゼ',
  'カプレーゼのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_061', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_061', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_061', 'ing_oil', 10, 'ml');

-- 202. ニース風サラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_062',
  'ニース風サラダ',
  'ニース風サラダのレシピです。',
  'side',
  'western',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_062', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_062', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_062', 'ing_oil', 10, 'ml');

-- 203. コブサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_063',
  'コブサラダ',
  'コブサラダのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_063', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_063', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_063', 'ing_oil', 10, 'ml');

-- 204. タコとセロリのサラダ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_064',
  'タコとセロリのサラダ',
  'タコとセロリのサラダのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_064', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_064', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_064', 'ing_oil', 10, 'ml');

-- 205. きのこのマリネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_065',
  'きのこのマリネ',
  'きのこのマリネのレシピです。',
  'side',
  'western',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_065', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_065', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_065', 'ing_oil', 10, 'ml');

-- 206. パプリカのマリネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_066',
  'パプリカのマリネ',
  'パプリカのマリネのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_066', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_066', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_066', 'ing_oil', 10, 'ml');

-- 207. ズッキーニのグリル
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_067',
  'ズッキーニのグリル',
  'ズッキーニのグリルのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_067', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_067', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_067', 'ing_oil', 10, 'ml');

-- 208. なすのマリネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_068',
  'なすのマリネ',
  'なすのマリネのレシピです。',
  'side',
  'western',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_068', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_068', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_068', 'ing_oil', 10, 'ml');

-- 209. トマトのファルシ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_069',
  'トマトのファルシ',
  'トマトのファルシのレシピです。',
  'side',
  'western',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_069', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_069', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_069', 'ing_oil', 10, 'ml');

-- 210. 野菜のピクルス
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_070',
  '野菜のピクルス',
  '野菜のピクルスのレシピです。',
  'side',
  'western',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を洗って切る。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_070', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_070', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_070', 'ing_oil', 10, 'ml');

-- 211. 味噌汁（大根・油揚げ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_011',
  '味噌汁（大根・油揚げ）',
  '味噌汁（大根・油揚げ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_011', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_011', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_011', 'ing_vegetable', 100, 'g');

-- 212. 味噌汁（キャベツ・玉ねぎ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_012',
  '味噌汁（キャベツ・玉ねぎ）',
  '味噌汁（キャベツ・玉ねぎ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_012', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_012', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_012', 'ing_vegetable', 100, 'g');

-- 213. 味噌汁（じゃがいも・玉ねぎ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_013',
  '味噌汁（じゃがいも・玉ねぎ）',
  '味噌汁（じゃがいも・玉ねぎ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_013', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_013', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_013', 'ing_vegetable', 100, 'g');

-- 214. 味噌汁（しじみ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_014',
  '味噌汁（しじみ）',
  '味噌汁（しじみ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_014', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_014', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_014', 'ing_vegetable', 100, 'g');

-- 215. 味噌汁（あさり）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_015',
  '味噌汁（あさり）',
  '味噌汁（あさり）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_015', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_015', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_015', 'ing_vegetable', 100, 'g');

-- 216. 味噌汁（豚汁風）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_016',
  '味噌汁（豚汁風）',
  '味噌汁（豚汁風）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'pork',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_016', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_016', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_016', 'ing_vegetable', 100, 'g');

-- 217. 味噌汁（白菜・油揚げ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_017',
  '味噌汁（白菜・油揚げ）',
  '味噌汁（白菜・油揚げ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_017', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_017', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_017', 'ing_vegetable', 100, 'g');

-- 218. 味噌汁（ほうれん草・えのき）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_018',
  '味噌汁（ほうれん草・えのき）',
  '味噌汁（ほうれん草・えのき）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_018', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_018', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_018', 'ing_vegetable', 100, 'g');

-- 219. 味噌汁（小松菜・油揚げ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_019',
  '味噌汁（小松菜・油揚げ）',
  '味噌汁（小松菜・油揚げ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_019', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_019', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_019', 'ing_vegetable', 100, 'g');

-- 220. 味噌汁（茄子・みょうが）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_020',
  '味噌汁（茄子・みょうが）',
  '味噌汁（茄子・みょうが）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_020', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_020', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_020', 'ing_vegetable', 100, 'g');

-- 221. 味噌汁（かぼちゃ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_021',
  '味噌汁（かぼちゃ）',
  '味噌汁（かぼちゃ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_021', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_021', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_021', 'ing_vegetable', 100, 'g');

-- 222. 味噌汁（さつまいも）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_022',
  '味噌汁（さつまいも）',
  '味噌汁（さつまいも）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_022', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_022', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_022', 'ing_vegetable', 100, 'g');

-- 223. 味噌汁（もやし・わかめ）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_023',
  '味噌汁（もやし・わかめ）',
  '味噌汁（もやし・わかめ）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_023', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_023', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_023', 'ing_vegetable', 100, 'g');

-- 224. 味噌汁（長ねぎ・豆腐）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_024',
  '味噌汁（長ねぎ・豆腐）',
  '味噌汁（長ねぎ・豆腐）のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  80,
  'soy',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_024', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_024', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_024', 'ing_vegetable', 100, 'g');

-- 225. 味噌汁（大根・にんじん）
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_025',
  '味噌汁（大根・にんじん）',
  '味噌汁（大根・にんじん）のレシピです。',
  'soup',
  'japanese',
  'easy',
  10,
  300,
  7,
  80,
  'other',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_025', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_025', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_025', 'ing_vegetable', 100, 'g');

-- 226. トマトスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_026',
  'トマトスープ',
  'トマトスープのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_026', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_026', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_026', 'ing_vegetable', 100, 'g');

-- 227. かぼちゃのポタージュ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_027',
  'かぼちゃのポタージュ',
  'かぼちゃのポタージュのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_027', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_027', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_027', 'ing_vegetable', 100, 'g');

-- 228. クラムチャウダー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_028',
  'クラムチャウダー',
  'クラムチャウダーのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_028', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_028', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_028', 'ing_vegetable', 100, 'g');

-- 229. オニオングラタンスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_029',
  'オニオングラタンスープ',
  'オニオングラタンスープのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_029', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_029', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_029', 'ing_vegetable', 100, 'g');

-- 230. じゃがいものポタージュ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_030',
  'じゃがいものポタージュ',
  'じゃがいものポタージュのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_030', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_030', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_030', 'ing_vegetable', 100, 'g');

-- 231. ブロッコリーのスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_031',
  'ブロッコリーのスープ',
  'ブロッコリーのスープのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_031', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_031', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_031', 'ing_vegetable', 100, 'g');

-- 232. にんじんのポタージュ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_032',
  'にんじんのポタージュ',
  'にんじんのポタージュのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_032', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_032', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_032', 'ing_vegetable', 100, 'g');

-- 233. きのこのスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_033',
  'きのこのスープ',
  'きのこのスープのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_033', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_033', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_033', 'ing_vegetable', 100, 'g');

-- 234. 卵スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_034',
  '卵スープ',
  '卵スープのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_034', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_034', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_034', 'ing_vegetable', 100, 'g');

-- 235. コンソメスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_035',
  'コンソメスープ',
  'コンソメスープのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_035', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_035', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_035', 'ing_vegetable', 100, 'g');

-- 236. ABCスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_036',
  'ABCスープ',
  'ABCスープのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_036', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_036', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_036', 'ing_vegetable', 100, 'g');

-- 237. 白菜のクリームスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_037',
  '白菜のクリームスープ',
  '白菜のクリームスープのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_037', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_037', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_037', 'ing_vegetable', 100, 'g');

-- 238. 豆乳スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_038',
  '豆乳スープ',
  '豆乳スープのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_038', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_038', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_038', 'ing_vegetable', 100, 'g');

-- 239. キャベツのスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_039',
  'キャベツのスープ',
  'キャベツのスープのレシピです。',
  'soup',
  'western',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_039', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_039', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_039', 'ing_vegetable', 100, 'g');

-- 240. 根菜のスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_040',
  '根菜のスープ',
  '根菜のスープのレシピです。',
  'soup',
  'western',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_040', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_040', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_040', 'ing_vegetable', 100, 'g');

-- 241. 卵とわかめの中華スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_041',
  '卵とわかめの中華スープ',
  '卵とわかめの中華スープのレシピです。',
  'soup',
  'chinese',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_041', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_041', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_041', 'ing_vegetable', 100, 'g');

-- 242. 豆腐と卵の中華スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_042',
  '豆腐と卵の中華スープ',
  '豆腐と卵の中華スープのレシピです。',
  'soup',
  'chinese',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_042', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_042', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_042', 'ing_vegetable', 100, 'g');

-- 243. もやしの中華スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_043',
  'もやしの中華スープ',
  'もやしの中華スープのレシピです。',
  'soup',
  'chinese',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_043', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_043', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_043', 'ing_vegetable', 100, 'g');

-- 244. 春雨スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_044',
  '春雨スープ',
  '春雨スープのレシピです。',
  'soup',
  'chinese',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_044', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_044', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_044', 'ing_vegetable', 100, 'g');

-- 245. 酸辣湯
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_045',
  '酸辣湯',
  '酸辣湯のレシピです。',
  'soup',
  'chinese',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_045', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_045', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_045', 'ing_vegetable', 100, 'g');

-- 246. ワンタンスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_046',
  'ワンタンスープ',
  'ワンタンスープのレシピです。',
  'soup',
  'chinese',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_046', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_046', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_046', 'ing_vegetable', 100, 'g');

-- 247. トムヤムクン風スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_047',
  'トムヤムクン風スープ',
  'トムヤムクン風スープのレシピです。',
  'soup',
  'chinese',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_047', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_047', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_047', 'ing_vegetable', 100, 'g');

-- 248. 参鶏湯風スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_048',
  '参鶏湯風スープ',
  '参鶏湯風スープのレシピです。',
  'soup',
  'chinese',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_048', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_048', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_048', 'ing_vegetable', 100, 'g');

-- 249. 冷製コーンスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_049',
  '冷製コーンスープ',
  '冷製コーンスープのレシピです。',
  'soup',
  'chinese',
  'easy',
  10,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_049', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_049', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_049', 'ing_vegetable', 100, 'g');

-- 250. 冷製トマトスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_050',
  '冷製トマトスープ',
  '冷製トマトスープのレシピです。',
  'soup',
  'chinese',
  'easy',
  15,
  300,
  7,
  80,
  'chicken',
  '["だしまたはスープを温める。","具材を入れて煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_050', 'ing_chicken_stock', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_050', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_050', 'ing_vegetable', 100, 'g');

-- 251. ロールキャベツ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_131',
  'ロールキャベツ',
  'ロールキャベツのレシピです。',
  'main',
  'western',
  'normal',
  25,
  1200,
  7,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_131', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_131', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_131', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_131', 'ing_oil', 15, 'ml');

-- 252. ミートローフ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_132',
  'ミートローフ',
  'ミートローフのレシピです。',
  'main',
  'western',
  'easy',
  35,
  1200,
  8,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_132', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_132', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_132', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_132', 'ing_oil', 15, 'ml');

-- 253. ローストビーフ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_133',
  'ローストビーフ',
  'ローストビーフのレシピです。',
  'main',
  'western',
  'normal',
  45,
  1200,
  9,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_133', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_133', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_133', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_133', 'ing_oil', 15, 'ml');

-- 254. ローストチキン
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_134',
  'ローストチキン',
  'ローストチキンのレシピです。',
  'main',
  'western',
  'easy',
  25,
  1200,
  7,
  80,
  'chicken',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_134', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_134', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_134', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_134', 'ing_oil', 15, 'ml');

-- 255. 牛タンシチュー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_135',
  '牛タンシチュー',
  '牛タンシチューのレシピです。',
  'main',
  'western',
  'normal',
  35,
  1200,
  8,
  75,
  'beef',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_135', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_135', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_135', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_135', 'ing_oil', 15, 'ml');

-- 256. スペアリブのBBQ風
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_136',
  'スペアリブのBBQ風',
  'スペアリブのBBQ風のレシピです。',
  'main',
  'western',
  'easy',
  45,
  1200,
  9,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_136', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_136', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_136', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_136', 'ing_oil', 15, 'ml');

-- 257. 手羽先の甘辛煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_137',
  '手羽先の甘辛煮',
  '手羽先の甘辛煮のレシピです。',
  'main',
  'western',
  'normal',
  25,
  1200,
  7,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_137', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_137', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_137', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_137', 'ing_oil', 15, 'ml');

-- 258. 手羽元の煮込み
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_138',
  '手羽元の煮込み',
  '手羽元の煮込みのレシピです。',
  'main',
  'western',
  'easy',
  35,
  1200,
  8,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_138', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_138', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_138', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_138', 'ing_oil', 15, 'ml');

-- 259. 鶏レバーの甘辛煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_139',
  '鶏レバーの甘辛煮',
  '鶏レバーの甘辛煮のレシピです。',
  'main',
  'western',
  'normal',
  45,
  1200,
  9,
  75,
  'chicken',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_139', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_139', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_139', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_139', 'ing_oil', 15, 'ml');

-- 260. 砂肝の炒め物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_140',
  '砂肝の炒め物',
  '砂肝の炒め物のレシピです。',
  'main',
  'western',
  'easy',
  25,
  1200,
  7,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_140', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_140', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_140', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_140', 'ing_oil', 15, 'ml');

-- 261. イカリング
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_141',
  'イカリング',
  'イカリングのレシピです。',
  'main',
  'japanese',
  'normal',
  35,
  1200,
  8,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_141', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_141', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_141', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_141', 'ing_oil', 15, 'ml');

-- 262. イカの煮付け
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_142',
  'イカの煮付け',
  'イカの煮付けのレシピです。',
  'main',
  'japanese',
  'easy',
  45,
  1200,
  9,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_142', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_142', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_142', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_142', 'ing_oil', 15, 'ml');

-- 263. イカ焼き
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_143',
  'イカ焼き',
  'イカ焼きのレシピです。',
  'main',
  'japanese',
  'normal',
  25,
  1200,
  7,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_143', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_143', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_143', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_143', 'ing_oil', 15, 'ml');

-- 264. タコの唐揚げ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_144',
  'タコの唐揚げ',
  'タコの唐揚げのレシピです。',
  'main',
  'japanese',
  'easy',
  35,
  1200,
  8,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_144', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_144', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_144', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_144', 'ing_oil', 15, 'ml');

-- 265. タコのカルパッチョ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_145',
  'タコのカルパッチョ',
  'タコのカルパッチョのレシピです。',
  'main',
  'japanese',
  'normal',
  45,
  1200,
  9,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_145', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_145', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_145', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_145', 'ing_oil', 15, 'ml');

-- 266. エビチリ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_146',
  'エビチリ',
  'エビチリのレシピです。',
  'main',
  'other',
  'easy',
  25,
  1200,
  7,
  80,
  'fish',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_146', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_146', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_146', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_146', 'ing_oil', 15, 'ml');

-- 267. エビマヨ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_147',
  'エビマヨ',
  'エビマヨのレシピです。',
  'main',
  'other',
  'normal',
  35,
  1200,
  8,
  75,
  'fish',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_147', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_147', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_147', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_147', 'ing_oil', 15, 'ml');

-- 268. エビのアヒージョ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_148',
  'エビのアヒージョ',
  'エビのアヒージョのレシピです。',
  'main',
  'other',
  'easy',
  45,
  1200,
  9,
  80,
  'fish',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_148', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_148', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_148', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_148', 'ing_oil', 15, 'ml');

-- 269. 貝のワイン蒸し
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_149',
  '貝のワイン蒸し',
  '貝のワイン蒸しのレシピです。',
  'main',
  'other',
  'normal',
  25,
  1200,
  7,
  75,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_149', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_149', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_149', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_149', 'ing_oil', 15, 'ml');

-- 270. あさりの酒蒸し
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_150',
  'あさりの酒蒸し',
  'あさりの酒蒸しのレシピです。',
  'main',
  'other',
  'easy',
  35,
  1200,
  8,
  80,
  'other',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_150', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_150', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_150', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_150', 'ing_oil', 15, 'ml');

-- 271. 鯖缶カレー
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'main_151',
  '鯖缶カレー',
  '鯖缶カレーのレシピです。',
  'main',
  'other',
  'normal',
  45,
  1200,
  9,
  75,
  'fish',
  '["材料を準備する。","調理する。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_151', 'ing_meat', 300, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_151', 'ing_onion', 1, '個');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_151', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('main_151', 'ing_oil', 15, 'ml');

-- 272. れんこんのきんぴら
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_071',
  'れんこんのきんぴら',
  'れんこんのきんぴらのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_071', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_071', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_071', 'ing_oil', 10, 'ml');

-- 273. たけのこの土佐煮
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_072',
  'たけのこの土佐煮',
  'たけのこの土佐煮のレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_072', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_072', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_072', 'ing_oil', 10, 'ml');

-- 274. ふきの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_073',
  'ふきの煮物',
  'ふきの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_073', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_073', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_073', 'ing_oil', 10, 'ml');

-- 275. 山菜の天ぷら
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_074',
  '山菜の天ぷら',
  '山菜の天ぷらのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_074', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_074', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_074', 'ing_oil', 10, 'ml');

-- 276. こごみのおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_075',
  'こごみのおひたし',
  'こごみのおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_075', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_075', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_075', 'ing_oil', 10, 'ml');

-- 277. ゼンマイの煮物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_076',
  'ゼンマイの煮物',
  'ゼンマイの煮物のレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_076', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_076', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_076', 'ing_oil', 10, 'ml');

-- 278. わらびのおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_077',
  'わらびのおひたし',
  'わらびのおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_077', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_077', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_077', 'ing_oil', 10, 'ml');

-- 279. 菜の花のおひたし
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_078',
  '菜の花のおひたし',
  '菜の花のおひたしのレシピです。',
  'side',
  'japanese',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_078', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_078', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_078', 'ing_oil', 10, 'ml');

-- 280. セロリのピクルス
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_079',
  'セロリのピクルス',
  'セロリのピクルスのレシピです。',
  'side',
  'japanese',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_079', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_079', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_079', 'ing_oil', 10, 'ml');

-- 281. ラディッシュのピクルス
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_080',
  'ラディッシュのピクルス',
  'ラディッシュのピクルスのレシピです。',
  'side',
  'japanese',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_080', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_080', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_080', 'ing_oil', 10, 'ml');

-- 282. パプリカのマリネ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_081',
  'パプリカのマリネ',
  'パプリカのマリネのレシピです。',
  'side',
  'other',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_081', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_081', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_081', 'ing_oil', 10, 'ml');

-- 283. きゅうりのキューちゃん風
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_082',
  'きゅうりのキューちゃん風',
  'きゅうりのキューちゃん風のレシピです。',
  'side',
  'other',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_082', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_082', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_082', 'ing_oil', 10, 'ml');

-- 284. 白菜の塩昆布和え
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_083',
  '白菜の塩昆布和え',
  '白菜の塩昆布和えのレシピです。',
  'side',
  'other',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_083', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_083', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_083', 'ing_oil', 10, 'ml');

-- 285. キャベツの塩昆布和え
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_084',
  'キャベツの塩昆布和え',
  'キャベツの塩昆布和えのレシピです。',
  'side',
  'other',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_084', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_084', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_084', 'ing_oil', 10, 'ml');

-- 286. もやしの塩昆布和え
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_085',
  'もやしの塩昆布和え',
  'もやしの塩昆布和えのレシピです。',
  'side',
  'other',
  'easy',
  20,
  500,
  8,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_085', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_085', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_085', 'ing_oil', 10, 'ml');

-- 287. ゴーヤチャンプル
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_086',
  'ゴーヤチャンプル',
  'ゴーヤチャンプルのレシピです。',
  'side',
  'other',
  'easy',
  10,
  500,
  6,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_086', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_086', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_086', 'ing_oil', 10, 'ml');

-- 288. もやし炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_087',
  'もやし炒め',
  'もやし炒めのレシピです。',
  'side',
  'other',
  'easy',
  15,
  500,
  7,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_087', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_087', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_087', 'ing_oil', 10, 'ml');

-- 289. 青椒肉絲風野菜炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_088',
  '青椒肉絲風野菜炒め',
  '青椒肉絲風野菜炒めのレシピです。',
  'side',
  'other',
  'easy',
  20,
  500,
  8,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_088', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_088', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_088', 'ing_oil', 10, 'ml');

-- 290. 八宝菜風野菜炒め
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_089',
  '八宝菜風野菜炒め',
  '八宝菜風野菜炒めのレシピです。',
  'side',
  'other',
  'easy',
  10,
  500,
  6,
  70,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_089', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_089', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_089', 'ing_oil', 10, 'ml');

-- 291. チンゲン菜の炒め物
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'side_090',
  'チンゲン菜の炒め物',
  'チンゲン菜の炒め物のレシピです。',
  'side',
  'other',
  'easy',
  15,
  500,
  7,
  75,
  'other',
  '["野菜を準備する。","調理する。","盛り付けて完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_090', 'ing_vegetable', 150, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_090', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('side_090', 'ing_oil', 10, 'ml');

-- 292. あおさの味噌汁
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_051',
  'あおさの味噌汁',
  'あおさの味噌汁のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  6,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_051', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_051', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_051', 'ing_vegetable', 100, 'g');

-- 293. じゅんさいの味噌汁
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_052',
  'じゅんさいの味噌汁',
  'じゅんさいの味噌汁のレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  7,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_052', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_052', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_052', 'ing_vegetable', 100, 'g');

-- 294. モロヘイヤのスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_053',
  'モロヘイヤのスープ',
  'モロヘイヤのスープのレシピです。',
  'soup',
  'japanese',
  'easy',
  15,
  300,
  8,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_053', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_053', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_053', 'ing_vegetable', 100, 'g');

-- 295. オクラのスープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_054',
  'オクラのスープ',
  'オクラのスープのレシピです。',
  'soup',
  'other',
  'easy',
  15,
  300,
  6,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_054', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_054', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_054', 'ing_vegetable', 100, 'g');

-- 296. ガスパチョ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_055',
  'ガスパチョ',
  'ガスパチョのレシピです。',
  'soup',
  'other',
  'easy',
  15,
  300,
  7,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_055', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_055', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_055', 'ing_vegetable', 100, 'g');

-- 297. ビシソワーズ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_056',
  'ビシソワーズ',
  'ビシソワーズのレシピです。',
  'soup',
  'other',
  'easy',
  15,
  300,
  8,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_056', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_056', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_056', 'ing_vegetable', 100, 'g');

-- 298. ボルシチ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_057',
  'ボルシチ',
  'ボルシチのレシピです。',
  'soup',
  'other',
  'easy',
  15,
  300,
  6,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_057', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_057', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_057', 'ing_vegetable', 100, 'g');

-- 299. サムゲタン風スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_058',
  'サムゲタン風スープ',
  'サムゲタン風スープのレシピです。',
  'soup',
  'other',
  'easy',
  15,
  300,
  7,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_058', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_058', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_058', 'ing_vegetable', 100, 'g');

-- 300. フォー風スープ
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  'soup_059',
  'フォー風スープ',
  'フォー風スープのレシピです。',
  'soup',
  'other',
  'easy',
  15,
  300,
  8,
  75,
  'other',
  '["だしを準備する。","具材を煮る。","味付けして完成。"]',
  '[]'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_059', 'ing_dashi', 600, 'ml');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_059', 'ing_salt', 2, 'g');
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('soup_059', 'ing_vegetable', 100, 'g');


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
