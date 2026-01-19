-- Add is_active column to recipes table
-- This allows us to temporarily disable incomplete recipes

ALTER TABLE recipes ADD COLUMN is_active INTEGER DEFAULT 1;

-- Disable recipes with dummy steps (野菜を洗って切る。)
UPDATE recipes 
SET is_active = 0 
WHERE steps_json LIKE '%野菜を洗って切る%';

-- Disable recipes with dummy steps (野菜を準備する。)
UPDATE recipes 
SET is_active = 0 
WHERE steps_json LIKE '%野菜を準備する%';

-- Log: Check how many recipes are disabled
SELECT 
  COUNT(*) as total_recipes,
  SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_recipes,
  SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_recipes
FROM recipes;
