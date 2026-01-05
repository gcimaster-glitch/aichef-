-- レシピに人気度カラムを追加
-- popularity: 1-10の人気度スコア（10が最も定番、1がマイナー）
ALTER TABLE recipes ADD COLUMN popularity INTEGER DEFAULT 5;

-- 定番メニューに高い人気度を設定
UPDATE recipes SET popularity = 10 WHERE title IN (
  '鶏の唐揚げ', '豚カツ', 'ハンバーグ', 'カレー', '生姜焼き',
  '鮭の塩焼き', 'チキンカレー', 'ビーフカレー', '餃子', 'から揚げ'
);

UPDATE recipes SET popularity = 9 WHERE title LIKE '%カレー%' OR title LIKE '%唐揚げ%' OR title LIKE '%ハンバーグ%';

UPDATE recipes SET popularity = 8 WHERE title IN (
  '麻婆豆腐', '回鍋肉', '酢豚', 'エビフライ', 'コロッケ',
  '焼き魚', 'チキンソテー', 'ポークソテー', '肉じゃが', '豚汁'
);

UPDATE recipes SET popularity = 7 WHERE title LIKE '%炒め%' OR title LIKE '%焼き%' OR title LIKE '%煮%';

-- 副菜の定番も設定
UPDATE recipes SET popularity = 9 WHERE role = 'side' AND title IN (
  'ポテトサラダ', '卵焼き', 'きんぴらごぼう', 'おひたし', 'お浸し',
  'もやしナムル', 'ナムル', 'マカロニサラダ', 'コールスロー'
);

-- 汁物の定番も設定
UPDATE recipes SET popularity = 10 WHERE role = 'soup' AND (
  title LIKE '%味噌汁%' OR title LIKE '豚汁%' OR title LIKE '%スープ%'
);

-- マイナーなメニュー（ちゃんちゃん焼き等）は低めに
UPDATE recipes SET popularity = 3 WHERE title LIKE '%ちゃんちゃん%';
UPDATE recipes SET popularity = 4 WHERE title LIKE '%南蛮%' OR title LIKE '%蒲焼%';
