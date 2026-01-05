-- 子供向けスコアカラムを追加
ALTER TABLE recipes ADD COLUMN child_friendly_score INTEGER DEFAULT 50;

-- 既存レシピにもスコアを設定
UPDATE recipes SET child_friendly_score = 80 WHERE title LIKE '%カレー%' OR title LIKE '%ハンバーグ%' OR title LIKE '%から揚げ%';
UPDATE recipes SET child_friendly_score = 60 WHERE child_friendly_score IS NULL;
