-- メールマガジン購読者テーブル
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  subscriber_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  household_id TEXT,
  name TEXT,
  status TEXT DEFAULT 'active', -- active, unsubscribed, bounced
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME,
  verification_token TEXT,
  is_verified INTEGER DEFAULT 0,
  preferences_json TEXT, -- 購読頻度、カテゴリなど
  FOREIGN KEY (household_id) REFERENCES households(household_id)
);

-- メールマガジン配信履歴テーブル
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  campaign_id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
  scheduled_at DATETIME,
  sent_at DATETIME,
  recipient_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- メールマガジン配信ログテーブル
CREATE TABLE IF NOT EXISTS newsletter_logs (
  log_id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  subscriber_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, opened, clicked, bounced, failed
  sent_at DATETIME,
  opened_at DATETIME,
  clicked_at DATETIME,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES newsletter_campaigns(campaign_id),
  FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(subscriber_id)
);

-- メールテンプレートテーブル
CREATE TABLE IF NOT EXISTS newsletter_templates (
  template_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  template_type TEXT, -- welcome, weekly, monthly, promotional
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_household ON newsletter_subscribers(household_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled ON newsletter_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_campaign ON newsletter_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_subscriber ON newsletter_logs(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_logs_status ON newsletter_logs(status);
