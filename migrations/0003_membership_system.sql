-- 会員制度システムのデータベーススキーマ（修正版）
-- 作成日: 2026-01-16
-- 既存テーブル構造:
-- members: member_id (TEXT PRIMARY KEY), email, password_hash, name, ...
-- donations: donation_id (TEXT PRIMARY KEY), household_id, donor_name, donor_email, amount, ...

-- 1. 会員テーブル（既存のmembersテーブルを拡張）
ALTER TABLE members ADD COLUMN full_name TEXT; -- 氏名（既存nameと併用）
ALTER TABLE members ADD COLUMN gender TEXT CHECK(gender IN ('male', 'female', 'other', NULL)); -- 性別
ALTER TABLE members ADD COLUMN relationship TEXT; -- 続柄
ALTER TABLE members ADD COLUMN phone TEXT; -- 電話番号
ALTER TABLE members ADD COLUMN prefecture TEXT; -- 都道府県
ALTER TABLE members ADD COLUMN member_type TEXT CHECK(member_type IN ('free', 'paid')) DEFAULT 'free'; -- 会員種別
ALTER TABLE members ADD COLUMN membership_expires_at TEXT; -- 会員有効期限
ALTER TABLE members ADD COLUMN monthly_generation_count INTEGER DEFAULT 0; -- 月間生成回数
ALTER TABLE members ADD COLUMN last_generation_month TEXT; -- 最後に生成した月（YYYY-MM形式）

-- 2. 寄付履歴テーブル（既存のdonationsテーブルを拡張）
-- 既存: donor_name があるので、donor_display_name を追加
ALTER TABLE donations ADD COLUMN donor_display_name TEXT; -- 寄付名（表示用、空の場合は自動生成）
ALTER TABLE donations ADD COLUMN donation_type TEXT CHECK(donation_type IN ('free', 'membership')) DEFAULT 'free'; -- 寄付種別
ALTER TABLE donations ADD COLUMN member_id TEXT; -- 会員IDを追加（household_idと併用）

-- 3. 家族構成テーブル（最大10名）
CREATE TABLE IF NOT EXISTS family_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL, -- members.member_idと紐付け（TEXT型）
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK(gender IN ('male', 'female', 'other')),
  relationship TEXT, -- 続柄（本人、配偶者、子供、父、母など）
  has_allergy INTEGER DEFAULT 0, -- アレルギーあり
  allergies_json TEXT DEFAULT '[]', -- アレルギー詳細（JSON配列）
  dislikes_json TEXT DEFAULT '[]', -- 嫌いな食べ物（JSON配列）
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

-- 4. メールリマインダー設定テーブル
CREATE TABLE IF NOT EXISTS email_reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id TEXT NOT NULL, -- members.member_idと紐付け（TEXT型）
  frequency TEXT CHECK(frequency IN ('daily', 'weekly', 'monthly')) DEFAULT 'weekly', -- 頻度
  enabled INTEGER DEFAULT 1, -- 有効/無効
  last_sent_at TEXT, -- 最後に送信した日時
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

-- 5. インデックス作成
CREATE INDEX IF NOT EXISTS idx_family_members_member_id ON family_members(member_id);
CREATE INDEX IF NOT EXISTS idx_email_reminders_member_id ON email_reminders(member_id);
CREATE INDEX IF NOT EXISTS idx_members_member_type ON members(member_type);
CREATE INDEX IF NOT EXISTS idx_members_expires_at ON members(membership_expires_at);
CREATE INDEX IF NOT EXISTS idx_donations_member_id ON donations(member_id);
CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(donation_type);

-- 6. 寄付メーター用のビュー
CREATE VIEW IF NOT EXISTS donation_meter AS
SELECT 
  COUNT(*) as total_donations,
  SUM(amount) as total_amount,
  SUM(amount) / 500 as children_helped, -- 500円で2名の子供の1食
  COUNT(DISTINCT COALESCE(member_id, household_id, donor_email)) as unique_donors
FROM donations
WHERE status = 'completed';

-- 7. 寄付者ランキング用のビュー（表示名の優先順位: donor_display_name > donor_name > member名）
CREATE VIEW IF NOT EXISTS donor_ranking AS
SELECT 
  COALESCE(d.member_id, d.household_id, d.donor_email) as donor_id,
  COALESCE(d.donor_display_name, d.donor_name, m.full_name, m.name) as display_name,
  SUM(d.amount) as total_donated,
  COUNT(*) as donation_count,
  MAX(d.created_at) as last_donation_at
FROM donations d
LEFT JOIN members m ON d.member_id = m.member_id
WHERE d.status = 'completed' AND d.is_public = 1
GROUP BY donor_id, display_name
ORDER BY total_donated DESC;
