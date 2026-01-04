PRAGMA foreign_keys = ON;

-- =========================
-- 0) 共通：マスタ
-- =========================

CREATE TABLE IF NOT EXISTS ingredients (
  ingredient_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN (
    'vegetables','meat_fish','dairy_eggs','tofu_beans','seasonings','others'
  )),
  default_unit TEXT NOT NULL DEFAULT 'g'
);

CREATE TABLE IF NOT EXISTS ingredient_aliases (
  alias TEXT PRIMARY KEY,
  ingredient_id TEXT NOT NULL,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

CREATE TABLE IF NOT EXISTS allergens (
  allergen_code TEXT PRIMARY KEY,
  label_ja TEXT NOT NULL
);

-- =========================
-- 1) レシピ（500件の受け皿）
-- =========================

CREATE TABLE IF NOT EXISTS recipes (
  recipe_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  role TEXT NOT NULL CHECK(role IN ('main','side','soup')),
  cuisine TEXT NOT NULL CHECK(cuisine IN ('japanese','western','chinese','other')),
  difficulty TEXT NOT NULL CHECK(difficulty IN ('easy','normal','hard')) DEFAULT 'normal',
  time_min INTEGER NOT NULL DEFAULT 30,

  primary_protein TEXT NOT NULL CHECK(primary_protein IN (
    'chicken','pork','beef','fish','egg','soy','other'
  )) DEFAULT 'other',

  cost_tier INTEGER NOT NULL CHECK(cost_tier IN (300,500,800,1000,1200,1500)),

  season_json TEXT DEFAULT '[]',
  steps_json TEXT NOT NULL DEFAULT '[]',
  substitutes_json TEXT NOT NULL DEFAULT '[]',
  tags_json TEXT NOT NULL DEFAULT '[]',

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id TEXT NOT NULL,
  ingredient_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  is_optional INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

CREATE TABLE IF NOT EXISTS recipe_allergens (
  recipe_id TEXT NOT NULL,
  allergen_code TEXT NOT NULL,
  PRIMARY KEY (recipe_id, allergen_code),
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
  FOREIGN KEY (allergen_code) REFERENCES allergens(allergen_code)
);

CREATE TABLE IF NOT EXISTS recipe_seasons (
  recipe_id TEXT NOT NULL,
  season TEXT NOT NULL CHECK(season IN ('spring','summer','autumn','winter')),
  PRIMARY KEY (recipe_id, season),
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_reuse_keys (
  recipe_id TEXT NOT NULL,
  key_name TEXT NOT NULL,
  PRIMARY KEY (recipe_id, key_name),
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- =========================
-- 2) ユーザー・家族プロファイル
-- =========================

CREATE TABLE IF NOT EXISTS households (
  household_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  members_count INTEGER NOT NULL CHECK(members_count >= 1),

  start_date TEXT NOT NULL,
  months INTEGER NOT NULL CHECK(months BETWEEN 1 AND 3) DEFAULT 1,

  season TEXT CHECK(season IN ('spring','summer','autumn','winter')),

  budget_tier_per_person INTEGER NOT NULL CHECK(budget_tier_per_person IN (300,500,800,1000,1200,1500)),
  budget_distribution TEXT NOT NULL CHECK(budget_distribution IN ('average','swing','custom')) DEFAULT 'average',

  cooking_time_limit_min INTEGER NOT NULL CHECK(cooking_time_limit_min IN (15,30,45,60)) DEFAULT 30,
  shopping_frequency TEXT NOT NULL CHECK(shopping_frequency IN ('daily','twice_weekly','weekly')) DEFAULT 'weekly',
  fish_frequency TEXT NOT NULL CHECK(fish_frequency IN ('low','normal','high')) DEFAULT 'normal',

  dislikes_json TEXT NOT NULL DEFAULT '[]',
  allergies_standard_json TEXT NOT NULL DEFAULT '[]',
  allergies_free_text_json TEXT NOT NULL DEFAULT '[]',

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS household_members (
  household_id TEXT NOT NULL,
  member_index INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('male','female','other','unknown')) DEFAULT 'unknown',
  age_band TEXT NOT NULL CHECK(age_band IN (
    'preschool','elementary','junior_high','high_school','adult','senior'
  )),
  PRIMARY KEY (household_id, member_index),
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS household_dislikes (
  household_id TEXT NOT NULL,
  ingredient_id TEXT NOT NULL,
  PRIMARY KEY (household_id, ingredient_id),
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

-- =========================
-- 3) 献立（計画）・日別
-- =========================

CREATE TABLE IF NOT EXISTS meal_plans (
  plan_id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  start_date TEXT NOT NULL,
  months INTEGER NOT NULL CHECK(months BETWEEN 1 AND 3) DEFAULT 1,
  status TEXT NOT NULL CHECK(status IN ('draft','generated','updated')) DEFAULT 'generated',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plan_days (
  plan_day_id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  date TEXT NOT NULL,
  estimated_time_min INTEGER NOT NULL DEFAULT 30,
  estimated_cost_tier INTEGER NOT NULL CHECK(estimated_cost_tier IN (300,500,800,1000,1200,1500)),
  note TEXT DEFAULT '',
  UNIQUE(plan_id, date),
  FOREIGN KEY (plan_id) REFERENCES meal_plans(plan_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_plan_day_recipes (
  plan_day_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('main','side','soup')),
  recipe_id TEXT NOT NULL,
  PRIMARY KEY (plan_day_id, role),
  FOREIGN KEY (plan_day_id) REFERENCES meal_plan_days(plan_day_id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id)
);

-- =========================
-- 4) 買い物リスト（週単位）
-- =========================

CREATE TABLE IF NOT EXISTS shopping_lists (
  shopping_list_id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(plan_id, week_start, week_end),
  FOREIGN KEY (plan_id) REFERENCES meal_plans(plan_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  shopping_list_id TEXT NOT NULL,
  ingredient_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN (
    'vegetables','meat_fish','dairy_eggs','tofu_beans','seasonings','others'
  )),
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  PRIMARY KEY (shopping_list_id, ingredient_id, unit),
  FOREIGN KEY (shopping_list_id) REFERENCES shopping_lists(shopping_list_id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
);

-- =========================
-- 5) インデックス（MVPでも効く）
-- =========================

CREATE INDEX IF NOT EXISTS idx_recipes_role_cost ON recipes(role, cost_tier);
CREATE INDEX IF NOT EXISTS idx_recipes_time ON recipes(time_min);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ing ON recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reuse_keys_key ON recipe_reuse_keys(key_name);
CREATE INDEX IF NOT EXISTS idx_plan_days_plan_date ON meal_plan_days(plan_id, date);
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
-- 基本アレルゲン
INSERT OR IGNORE INTO allergens (allergen_code, label_ja) VALUES
  ('egg', '卵'),
  ('milk', '乳'),
  ('wheat', '小麦'),
  ('shrimp', 'えび'),
  ('crab', 'かに'),
  ('buckwheat', 'そば'),
  ('peanut', '落花生');

-- 基本食材マスタ（低予算向け必須30種）
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category, default_unit) VALUES
  -- たんぱく質（8）
  ('ing_chicken', '鶏むね肉', 'meat_fish', 'g'),
  ('ing_pork', '豚こま肉', 'meat_fish', 'g'),
  ('ing_fish', '魚', 'meat_fish', 'g'),
  ('ing_egg', '卵', 'dairy_eggs', '個'),
  ('ing_tofu', '豆腐', 'tofu_beans', 'g'),
  ('ing_minced_meat', 'ひき肉', 'meat_fish', 'g'),
  ('ing_sausage', 'ソーセージ', 'meat_fish', '本'),
  ('ing_canned_tuna', 'ツナ缶', 'meat_fish', '缶'),
  
  -- 野菜（12）
  ('ing_onion', '玉ねぎ', 'vegetables', '個'),
  ('ing_carrot', 'にんじん', 'vegetables', '本'),
  ('ing_cabbage', 'キャベツ', 'vegetables', 'g'),
  ('ing_moyashi', 'もやし', 'vegetables', '袋'),
  ('ing_potato', 'じゃがいも', 'vegetables', '個'),
  ('ing_daikon', '大根', 'vegetables', 'g'),
  ('ing_negi', '長ねぎ', 'vegetables', '本'),
  ('ing_spinach', 'ほうれん草', 'vegetables', '束'),
  ('ing_tomato', 'トマト', 'vegetables', '個'),
  ('ing_lettuce', 'レタス', 'vegetables', '個'),
  ('ing_mushroom', 'きのこ', 'vegetables', 'パック'),
  ('ing_green_pepper', 'ピーマン', 'vegetables', '個'),
  
  -- 炭水化物・主食（4）
  ('ing_rice', 'ごはん', 'others', 'g'),
  ('ing_udon', 'うどん', 'others', '玉'),
  ('ing_pasta', 'パスタ', 'others', 'g'),
  ('ing_bread', 'パン', 'others', '枚'),
  
  -- 基本調味料（6）
  ('ing_salt', '塩', 'seasonings', 'g'),
  ('ing_soy_sauce', '醤油', 'seasonings', 'ml'),
  ('ing_miso', '味噌', 'seasonings', 'g'),
  ('ing_vinegar', '酢', 'seasonings', 'ml'),
  ('ing_oil', '油', 'seasonings', 'ml'),
  ('ing_mayonnaise', 'マヨネーズ', 'seasonings', 'g');

-- 食材別名辞書（よくある表記ゆれ）
INSERT OR IGNORE INTO ingredient_aliases (alias, ingredient_id) VALUES
  ('たまねぎ', 'ing_onion'),
  ('オニオン', 'ing_onion'),
  ('人参', 'ing_carrot'),
  ('キャベツ', 'ing_cabbage'),
  ('もやし', 'ing_moyashi'),
  ('モヤシ', 'ing_moyashi'),
  ('じゃが芋', 'ing_potato'),
  ('ジャガイモ', 'ing_potato'),
  ('ネギ', 'ing_negi'),
  ('ねぎ', 'ing_negi'),
  ('青菜', 'ing_spinach'),
  ('トマト', 'ing_tomato'),
  ('レタス', 'ing_lettuce'),
  ('きのこ', 'ing_mushroom'),
  ('キノコ', 'ing_mushroom'),
  ('ピーマン', 'ing_green_pepper'),
  ('ぴーまん', 'ing_green_pepper'),
  ('鶏肉', 'ing_chicken'),
  ('鶏むね', 'ing_chicken'),
  ('豚肉', 'ing_pork'),
  ('豆腐', 'ing_tofu'),
  ('とうふ', 'ing_tofu'),
  ('たまご', 'ing_egg'),
  ('玉子', 'ing_egg'),
  ('ご飯', 'ing_rice'),
  ('米', 'ing_rice');
