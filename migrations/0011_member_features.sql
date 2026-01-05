-- 会員管理・メルマガ・問い合わせ・広告機能のスキーマ追加

-- ============================================
-- 1. 会員管理
-- ============================================

-- 会員テーブル
CREATE TABLE IF NOT EXISTS members (
  member_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  profile_image_url TEXT,
  status TEXT DEFAULT 'active', -- active, suspended, deleted
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME
);

-- 会員セッション（ログイン管理）
CREATE TABLE IF NOT EXISTS member_sessions (
  session_id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE
);

-- お気に入りレシピ
CREATE TABLE IF NOT EXISTS favorite_recipes (
  member_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (member_id, recipe_id),
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);

-- households テーブルに member_id カラムを追加（既存の household_id はそのまま）
-- ALTER TABLE households ADD COLUMN member_id TEXT;
-- Note: Cloudflare D1 では ALTER TABLE ADD COLUMN が制限されているため、
-- 新規作成時のみこのカラムを追加することを推奨します。
-- 既存テーブルの場合は、アプリケーション層で member_id を管理します。

-- ============================================
-- 2. メルマガ管理
-- ============================================

-- メルマガ購読者
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  subscriber_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  member_id TEXT, -- NULL可（非会員でも登録可能）
  status TEXT DEFAULT 'active', -- active, unsubscribed
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME,
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE SET NULL
);

-- メルマガ配信履歴
CREATE TABLE IF NOT EXISTS newsletter_deliveries (
  delivery_id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  recipient_count INTEGER DEFAULT 0
);

-- メルマガ配信ログ（個別の送信記録）
CREATE TABLE IF NOT EXISTS newsletter_logs (
  log_id TEXT PRIMARY KEY,
  delivery_id TEXT NOT NULL,
  subscriber_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'sent', -- sent, failed, opened, clicked
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (delivery_id) REFERENCES newsletter_deliveries(delivery_id) ON DELETE CASCADE
);

-- ============================================
-- 3. チャット問い合わせ
-- ============================================

-- 問い合わせスレッド
CREATE TABLE IF NOT EXISTS support_threads (
  thread_id TEXT PRIMARY KEY,
  member_id TEXT, -- NULL可（非会員でも問い合わせ可能）
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(member_id) ON DELETE SET NULL
);

-- 問い合わせメッセージ
CREATE TABLE IF NOT EXISTS support_messages (
  message_id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  sender_type TEXT NOT NULL, -- member, admin
  sender_id TEXT, -- member_id または admin_id
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES support_threads(thread_id) ON DELETE CASCADE
);

-- ============================================
-- 4. 広告管理
-- ============================================

-- 広告枠（設置位置の管理）
CREATE TABLE IF NOT EXISTS ad_slots (
  slot_id TEXT PRIMARY KEY,
  slot_name TEXT UNIQUE NOT NULL, -- 例: top_banner, sidebar_1, calendar_bottom
  page_location TEXT NOT NULL, -- 例: top_page, calendar_page, recipe_detail
  position TEXT NOT NULL, -- 例: header, sidebar, footer, inline
  width INTEGER, -- ピクセル
  height INTEGER, -- ピクセル
  description TEXT,
  is_active INTEGER DEFAULT 1, -- 0=無効, 1=有効
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 広告コンテンツ（バナー画像やアフィリエイトリンク）
CREATE TABLE IF NOT EXISTS ad_contents (
  ad_id TEXT PRIMARY KEY,
  slot_id TEXT NOT NULL,
  ad_type TEXT NOT NULL, -- banner, affiliate_link, text
  title TEXT NOT NULL,
  image_url TEXT, -- バナー画像のURL
  link_url TEXT NOT NULL, -- クリック時のリンク先
  html_code TEXT, -- アフィリエイトコード（HTMLタグ）
  priority INTEGER DEFAULT 1, -- 表示優先度（高い方が優先）
  start_date DATE,
  end_date DATE,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slot_id) REFERENCES ad_slots(slot_id) ON DELETE CASCADE
);

-- 広告クリック数トラッキング
CREATE TABLE IF NOT EXISTS ad_clicks (
  click_id TEXT PRIMARY KEY,
  ad_id TEXT NOT NULL,
  member_id TEXT, -- NULL可（非会員のクリックも記録）
  ip_address TEXT,
  user_agent TEXT,
  clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_id) REFERENCES ad_contents(ad_id) ON DELETE CASCADE
);

-- 広告インプレッション数（表示回数）
CREATE TABLE IF NOT EXISTS ad_impressions (
  impression_id TEXT PRIMARY KEY,
  ad_id TEXT NOT NULL,
  member_id TEXT,
  page_location TEXT NOT NULL,
  viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ad_id) REFERENCES ad_contents(ad_id) ON DELETE CASCADE
);

-- ============================================
-- 5. インデックス作成（パフォーマンス最適化）
-- ============================================

CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_member_sessions_token ON member_sessions(token);
CREATE INDEX IF NOT EXISTS idx_member_sessions_member_id ON member_sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_member_id ON favorite_recipes(member_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_member_id ON newsletter_subscribers(member_id);
CREATE INDEX IF NOT EXISTS idx_support_threads_member_id ON support_threads(member_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_thread_id ON support_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_ad_clicks_ad_id ON ad_clicks(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_ad_id ON ad_impressions(ad_id);
