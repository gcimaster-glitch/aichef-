-- Add missing ingredients
INSERT OR IGNORE INTO ingredients (ingredient_id, name, category) VALUES
('grain_flour', '小麦粉', 'grains'),
('seasoning_oil', 'サラダ油', 'seasonings'),
('seasoning_mayo', 'マヨネーズ', 'seasonings'),
('seasoning_ketchup', 'ケチャップ', 'seasonings'),
('seasoning_dashi', 'だし', 'seasonings'),
('seasoning_curry', 'カレールー', 'seasonings'),
('seasoning_dressing', 'ドレッシング', 'seasonings'),
('seafood_octopus', 'タコ', 'seafood'),
('fish_sardine', 'イワシ', 'fish');
