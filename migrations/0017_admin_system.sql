-- 0017_admin_system.sql
-- 管理画面システム用テーブル

-- 管理者ユーザーテーブル
CREATE TABLE IF NOT EXISTS admin_users (
  admin_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('super_admin', 'admin', 'viewer')) DEFAULT 'admin',
  is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- アクセスログテーブル
CREATE TABLE IF NOT EXISTS access_logs (
  log_id TEXT PRIMARY KEY,
  household_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  page_path TEXT NOT NULL,
  action TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_access_logs_household ON access_logs(household_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_created_at ON access_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_access_logs_page_path ON access_logs(page_path);

-- ユーザー分析テーブル（集計用）
CREATE TABLE IF NOT EXISTS user_analytics (
  analytics_id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_plans INTEGER DEFAULT 0,
  avg_family_size REAL DEFAULT 0,
  male_count INTEGER DEFAULT 0,
  female_count INTEGER DEFAULT 0,
  children_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON user_analytics(date);

-- メールキャンペーンテーブル
CREATE TABLE IF NOT EXISTS email_campaigns (
  campaign_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('draft', 'scheduled', 'sending', 'sent', 'archived')) DEFAULT 'draft',
  scheduled_at TEXT,
  sent_at TEXT,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES admin_users(admin_id)
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);

-- メールテンプレートテーブル
CREATE TABLE IF NOT EXISTS email_templates (
  template_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  signature_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (created_by) REFERENCES admin_users(admin_id)
);

-- 署名管理テーブル
CREATE TABLE IF NOT EXISTS email_signatures (
  signature_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- メール配信ログテーブル
CREATE TABLE IF NOT EXISTS email_logs (
  log_id TEXT PRIMARY KEY,
  campaign_id TEXT,
  recipient_email TEXT NOT NULL,
  household_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'failed', 'opened', 'clicked')) DEFAULT 'pending',
  opened_at TEXT,
  clicked_at TEXT,
  error_message TEXT,
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (campaign_id) REFERENCES email_campaigns(campaign_id) ON DELETE CASCADE,
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_email_logs_campaign ON email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_household ON email_logs(household_id);

-- 献立履歴テーブル（ユーザーが過去に作成した献立を保存）
CREATE TABLE IF NOT EXISTS plan_history (
  history_id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  title TEXT NOT NULL,
  start_date TEXT NOT NULL,
  months INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  is_archived INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES meal_plans(plan_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_plan_history_household ON plan_history(household_id);
CREATE INDEX IF NOT EXISTS idx_plan_history_created_at ON plan_history(created_at);

-- ユーザー評価テーブル
CREATE TABLE IF NOT EXISTS user_feedback (
  feedback_id TEXT PRIMARY KEY,
  household_id TEXT,
  plan_id TEXT,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id) REFERENCES meal_plans(plan_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_user_feedback_household ON user_feedback(household_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_rating ON user_feedback(rating);

-- 初期管理者アカウント（パスワード: admin123）
-- 本番環境では必ず変更してください
INSERT OR IGNORE INTO admin_users (admin_id, email, password_hash, name, role)
VALUES (
  'admin-001',
  'admin@aichef.com',
  '$2a$10$rZ8qKq5L5L5L5L5L5L5L5O',  -- 仮のハッシュ（実装時に bcrypt で生成）
  'システム管理者',
  'super_admin'
);

-- デフォルト署名
INSERT OR IGNORE INTO email_signatures (signature_id, name, content_html, content_text, is_default)
VALUES (
  'sig-001',
  'デフォルト署名',
  '<p>━━━━━━━━━━━━━━━━<br>Aメニュー運営チーム<br>お問い合わせ: support@aichef.com<br>https://aichef.com<br>━━━━━━━━━━━━━━━━</p>',
  '━━━━━━━━━━━━━━━━\nAメニュー運営チーム\nお問い合わせ: support@aichef.com\nhttps://aichef.com\n━━━━━━━━━━━━━━━━',
  1
);
