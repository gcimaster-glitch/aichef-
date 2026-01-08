-- Stripe決済管理テーブル

-- サブスクリプション（月額会員）管理
CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
  plan_type TEXT NOT NULL DEFAULT 'monthly', -- monthly, yearly
  amount INTEGER NOT NULL, -- 金額（円）
  current_period_start DATETIME,
  current_period_end DATETIME,
  cancel_at_period_end INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  canceled_at DATETIME,
  FOREIGN KEY (household_id) REFERENCES households(household_id)
);

-- 決済履歴（寄付・サブスクリプション両方）
CREATE TABLE IF NOT EXISTS payment_transactions (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  payment_type TEXT NOT NULL, -- donation, subscription
  amount INTEGER NOT NULL, -- 金額（円）
  currency TEXT DEFAULT 'jpy',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, refunded
  payment_method TEXT, -- card, bank_transfer等
  card_last4 TEXT, -- カード下4桁
  card_brand TEXT, -- visa, mastercard等
  receipt_email TEXT,
  receipt_url TEXT,
  error_message TEXT,
  metadata_json TEXT, -- 追加情報（JSON形式）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (household_id) REFERENCES households(household_id)
);

-- メール送信履歴
CREATE TABLE IF NOT EXISTS email_notifications (
  notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER,
  email_to TEXT NOT NULL,
  email_type TEXT NOT NULL, -- payment_confirm, subscription_confirm, receipt
  subject TEXT NOT NULL,
  content_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  sent_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (household_id) REFERENCES households(household_id)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_subscriptions_household ON subscriptions(household_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_household ON payment_transactions(household_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_id ON payment_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(payment_type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_household ON email_notifications(household_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
