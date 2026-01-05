-- 子供の年齢情報をJSON形式で保存するカラムを追加
ALTER TABLE households ADD COLUMN children_ages_json TEXT DEFAULT '[]';

-- コメント: children_ages_json は JSON配列形式で子供の年齢を格納
-- 例: '[3, 7, 12]' は 3歳、7歳、12歳の子供がいることを示す
