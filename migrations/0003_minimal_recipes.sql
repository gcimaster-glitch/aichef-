-- シンプルなサンプルレシピ（3品のみ）

-- 主菜
INSERT OR IGNORE INTO recipes (recipe_id, title, description, role, cuisine, difficulty, time_min, primary_protein, cost_tier, steps_json, substitutes_json, tags_json, season_json) VALUES
  ('rcp_001', '鶏むねの照り焼き', '節約でも満足', 'main', 'japanese', 'easy', 25, 'chicken', 500, '["鶏むねをそぎ切りにする","タレを絡めて焼く"]', '["鶏ももでも可"]', '["焼く","甘辛"]', '["winter"]');

-- 副菜
INSERT OR IGNORE INTO recipes (recipe_id, title, description, role, cuisine, difficulty, time_min, primary_protein, cost_tier, steps_json, substitutes_json, tags_json, season_json) VALUES
  ('rcp_002', 'キャベツの浅漬け', '作り置き可', 'side', 'japanese', 'easy', 10, 'other', 300, '["塩でもむ","10分置く"]', '["白菜でも可"]', '["和える","さっぱり"]', '["winter"]');

-- 汁物
INSERT OR IGNORE INTO recipes (recipe_id, title, description, role, cuisine, difficulty, time_min, primary_protein, cost_tier, steps_json, substitutes_json, tags_json, season_json) VALUES
  ('rcp_003', '豆腐の味噌汁', '定番', 'soup', 'japanese', 'easy', 10, 'soy', 300, '["だしを温める","豆腐を入れる","味噌を溶く"]', '["油揚げでも可"]', '["煮る","汁物"]', '[]');

-- レシピ材料（1人前基準）
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
  ('rcp_001', 'ing_chicken', 120, 'g', 0),
  ('rcp_001', 'ing_soy_sauce', 15, 'ml', 0),
  ('rcp_001', 'ing_onion', 0.25, '個', 0),
  
  ('rcp_002', 'ing_cabbage', 120, 'g', 0),
  ('rcp_002', 'ing_salt', 2, 'g', 0),
  
  ('rcp_003', 'ing_tofu', 80, 'g', 0),
  ('rcp_003', 'ing_miso', 12, 'g', 0);

-- reuse_keys（食材使い回しキー）
INSERT OR IGNORE INTO recipe_reuse_keys (recipe_id, key_name) VALUES
  ('rcp_001', 'chicken'),
  ('rcp_001', 'onion'),
  ('rcp_001', 'soy_sauce'),
  
  ('rcp_002', 'cabbage'),
  ('rcp_002', 'salt'),
  
  ('rcp_003', 'tofu'),
  ('rcp_003', 'miso');

-- 季節タグ
INSERT OR IGNORE INTO recipe_seasons (recipe_id, season) VALUES
  ('rcp_001', 'winter'),
  ('rcp_002', 'winter');
