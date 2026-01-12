-- ステップ1: 不完全なレシピを一時的に非表示化（popularity = 0）
UPDATE recipes 
SET popularity = 0 
WHERE recipe_id IN (
  SELECT r.recipe_id 
  FROM recipes r 
  LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id 
  GROUP BY r.recipe_id 
  HAVING COUNT(ri.ingredient_id) < 3
);

-- ステップ2: 完全なレシピのみを表示対象にする（popularity >= 5）
UPDATE recipes 
SET popularity = 10 
WHERE recipe_id IN (
  SELECT r.recipe_id 
  FROM recipes r 
  LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id 
  GROUP BY r.recipe_id 
  HAVING COUNT(ri.ingredient_id) >= 5
);

-- ステップ3: steps_jsonが空または不完全なレシピも非表示
UPDATE recipes 
SET popularity = 0 
WHERE steps_json = '[]' 
   OR steps_json = '' 
   OR steps_json IS NULL;
