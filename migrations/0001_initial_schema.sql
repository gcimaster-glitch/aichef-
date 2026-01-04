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
