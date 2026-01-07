-- ========================================
-- 寄付テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS donations (
  donation_id TEXT PRIMARY KEY,
  household_id TEXT,  -- 会員の場合は紐付け、未会員の場合はNULL
  
  -- 寄付者情報
  donor_name TEXT NOT NULL,  -- 表示名（本名不要）
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  
  -- 寄付情報
  amount INTEGER NOT NULL CHECK(amount >= 300 AND amount <= 3000),  -- 300円〜3000円（1〜10口）
  unit_count INTEGER NOT NULL CHECK(unit_count BETWEEN 1 AND 10),  -- 口数（1〜10口）
  
  -- メッセージ
  message TEXT,  -- 寄付者からのメッセージ（任意）
  
  -- ステータス
  status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT DEFAULT 'bank_transfer',
  
  -- 公開設定
  is_public INTEGER NOT NULL DEFAULT 1,  -- 1: 公開、0: 非公開
  
  -- タイムスタンプ
  created_at DATETIME DEFAULT (datetime('now')),
  updated_at DATETIME DEFAULT (datetime('now')),
  
  FOREIGN KEY (household_id) REFERENCES households(household_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_donations_household ON donations(household_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_public ON donations(is_public);

-- ========================================
-- 寄付証明書テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS donation_certificates (
  certificate_id TEXT PRIMARY KEY,
  donation_id TEXT NOT NULL,
  
  -- 証明書情報
  certificate_number TEXT NOT NULL UNIQUE,  -- 証明書番号（例: DC-2026-001）
  issue_date DATE NOT NULL,
  
  -- PDFファイル情報（将来的に実装）
  pdf_url TEXT,
  
  created_at DATETIME DEFAULT (datetime('now')),
  
  FOREIGN KEY (donation_id) REFERENCES donations(donation_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_certificates_donation ON donation_certificates(donation_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON donation_certificates(certificate_number);
