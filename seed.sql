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
