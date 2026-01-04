PRAGMA foreign_keys = OFF;

-- サンプルレシピ（10品：主菜5、副菜3、汁物2）

-- 主菜
INSERT OR IGNORE INTO recipes (recipe_id, title, description, role, cuisine, difficulty, time_min, primary_protein, cost_tier, steps_json, substitutes_json, tags_json, season_json) VALUES
  ('rcp_teriyaki_chicken', '鶏むねの照り焼き', '節約でも満足', 'main', 'japanese', 'easy', 25, 'chicken', 500, '["鶏むねをそぎ切りにする","タレを絡めて焼く"]', '["鶏ももでも可"]', '["焼く","甘辛"]', '["winter"]'),
  ('rcp_pork_ginger', '豚肉の生姜焼き', '定番', 'main', 'japanese', 'easy', 20, 'pork', 500, '["豚肉を切る","生姜タレで炒める"]', '["豚ロースでも可"]', '["炒める","甘辛"]', '["winter","autumn"]'),
  ('rcp_hamburg', '和風ハンバーグ', '家族に人気', 'main', 'japanese', 'normal', 35, 'minced', 800, '["ひき肉を練る","焼く","和風ソースで"]', '["鶏ひき肉でも可"]', '["焼く","こってり"]', '[]'),
  ('rcp_fish_nitsuke', '魚の煮付け', '和の基本', 'main', 'japanese', 'normal', 30, 'fish', 800, '["魚を下処理","煮汁で煮る"]', '["サバ・サワラなど"]', '["煮る","さっぱり"]', '["winter"]'),
  ('rcp_tofu_steak', '豆腐ステーキ', '節約・ヘルシー', 'main', 'japanese', 'easy', 15, 'soy', 300, '["豆腐を切る","焼く","タレをかける"]', '["厚揚げでも可"]', '["焼く","さっぱり"]', '[]');

-- 副菜
INSERT OR IGNORE INTO recipes (recipe_id, title, description, role, cuisine, difficulty, time_min, primary_protein, cost_tier, steps_json, substitutes_json, tags_json, season_json) VALUES
  ('rcp_cabbage_pickle', 'キャベツの浅漬け', '作り置き可', 'side', 'japanese', 'easy', 10, 'other', 300, '["塩でもむ","10分置く"]', '["白菜でも可"]', '["和える","さっぱり"]', '["winter"]'),
  ('rcp_carrot_kinpira', 'にんじんのきんぴら', '常備菜', 'side', 'japanese', 'easy', 15, 'other', 300, '["細切りにする","炒める","調味料で"]', '["ごぼうも追加可"]', '["炒める","甘辛"]', '[]'),
  ('rcp_spinach_ohitashi', 'ほうれん草のおひたし', '定番', 'side', 'japanese', 'easy', 10, 'other', 300, '["茹でる","水気を切る","だしと醤油"]', '["小松菜でも可"]', '["茹でる","さっぱり"]', '[]');

-- 汁物
INSERT OR IGNORE INTO recipes (recipe_id, title, description, role, cuisine, difficulty, time_min, primary_protein, cost_tier, steps_json, substitutes_json, tags_json, season_json) VALUES
  ('rcp_miso_tofu', '豆腐とわかめの味噌汁', '定番', 'soup', 'japanese', 'easy', 10, 'soy', 300, '["だしを温める","豆腐とわかめを入れる","味噌を溶く"]', '["油揚げでも可"]', '["煮る","汁物"]', '[]'),
  ('rcp_egg_soup', '卵スープ', 'シンプル', 'soup', 'chinese', 'easy', 10, 'egg', 300, '["鶏ガラスープを温める","卵を溶き入れる"]', '["わかめ追加可"]', '["煮る","汁物"]', '[]');

-- レシピ材料（1人前基準）
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES
  -- 鶏むねの照り焼き
  ('rcp_teriyaki_chicken', 'ing_chicken', 120, 'g', 0),
  ('rcp_teriyaki_chicken', 'ing_soy_sauce', 15, 'ml', 0),
  ('rcp_teriyaki_chicken', 'ing_onion', 0.25, '個', 0),
  
  -- 豚肉の生姜焼き
  ('rcp_pork_ginger', 'ing_pork', 100, 'g', 0),
  ('rcp_pork_ginger', 'ing_soy_sauce', 15, 'ml', 0),
  ('rcp_pork_ginger', 'ing_onion', 0.25, '個', 0),
  
  -- 和風ハンバーグ
  ('rcp_hamburg', 'ing_minced_meat', 100, 'g', 0),
  ('rcp_hamburg', 'ing_onion', 0.3, '個', 0),
  ('rcp_hamburg', 'ing_egg', 0.25, '個', 0),
  
  -- 魚の煮付け
  ('rcp_fish_nitsuke', 'ing_fish', 120, 'g', 0),
  ('rcp_fish_nitsuke', 'ing_soy_sauce', 20, 'ml', 0),
  
  -- 豆腐ステーキ
  ('rcp_tofu_steak', 'ing_tofu', 150, 'g', 0),
  ('rcp_tofu_steak', 'ing_soy_sauce', 10, 'ml', 0),
  
  -- キャベツの浅漬け
  ('rcp_cabbage_pickle', 'ing_cabbage', 120, 'g', 0),
  ('rcp_cabbage_pickle', 'ing_salt', 2, 'g', 0),
  
  -- にんじんのきんぴら
  ('rcp_carrot_kinpira', 'ing_carrot', 0.5, '本', 0),
  ('rcp_carrot_kinpira', 'ing_soy_sauce', 10, 'ml', 0),
  ('rcp_carrot_kinpira', 'ing_oil', 5, 'ml', 0),
  
  -- ほうれん草のおひたし
  ('rcp_spinach_ohitashi', 'ing_spinach', 0.5, '束', 0),
  ('rcp_spinach_ohitashi', 'ing_soy_sauce', 10, 'ml', 0),
  
  -- 豆腐とわかめの味噌汁
  ('rcp_miso_tofu', 'ing_tofu', 80, 'g', 0),
  ('rcp_miso_tofu', 'ing_miso', 12, 'g', 0),
  
  -- 卵スープ
  ('rcp_egg_soup', 'ing_egg', 1, '個', 0),
  ('rcp_egg_soup', 'ing_salt', 1, 'g', 0);

-- reuse_keys（食材使い回しキー）
INSERT OR IGNORE INTO recipe_reuse_keys (recipe_id, key_name) VALUES
  ('rcp_teriyaki_chicken', 'chicken'),
  ('rcp_teriyaki_chicken', 'onion'),
  ('rcp_teriyaki_chicken', 'soy_sauce'),
  
  ('rcp_pork_ginger', 'pork'),
  ('rcp_pork_ginger', 'onion'),
  ('rcp_pork_ginger', 'soy_sauce'),
  
  ('rcp_hamburg', 'minced_meat'),
  ('rcp_hamburg', 'onion'),
  ('rcp_hamburg', 'egg'),
  
  ('rcp_fish_nitsuke', 'fish'),
  ('rcp_fish_nitsuke', 'soy_sauce'),
  
  ('rcp_tofu_steak', 'tofu'),
  ('rcp_tofu_steak', 'soy_sauce'),
  
  ('rcp_cabbage_pickle', 'cabbage'),
  ('rcp_cabbage_pickle', 'salt'),
  
  ('rcp_carrot_kinpira', 'carrot'),
  ('rcp_carrot_kinpira', 'soy_sauce'),
  ('rcp_carrot_kinpira', 'oil'),
  
  ('rcp_spinach_ohitashi', 'spinach'),
  ('rcp_spinach_ohitashi', 'soy_sauce'),
  
  ('rcp_miso_tofu', 'tofu'),
  ('rcp_miso_tofu', 'miso'),
  
  ('rcp_egg_soup', 'egg'),
  ('rcp_egg_soup', 'salt');

-- 季節タグ
INSERT OR IGNORE INTO recipe_seasons (recipe_id, season) VALUES
  ('rcp_teriyaki_chicken', 'winter'),
  ('rcp_pork_ginger', 'winter'),
  ('rcp_pork_ginger', 'autumn'),
  ('rcp_fish_nitsuke', 'winter'),
  ('rcp_cabbage_pickle', 'winter');

-- アレルゲンタグ（該当するもののみ）
INSERT OR IGNORE INTO recipe_allergens (recipe_id, allergen_code) VALUES
  ('rcp_hamburg', 'egg');
