-- =====================================================
-- マイグレーション: member_sessions テーブル拡張
-- =====================================================
-- 作成日: 2026-01-19
-- 目的: JWT認証に必要なカラムを追加
-- =====================================================

-- refresh_token カラムを追加
ALTER TABLE member_sessions ADD COLUMN refresh_token TEXT;

-- is_active カラムを追加（デフォルト: 1=アクティブ）
ALTER TABLE member_sessions ADD COLUMN is_active INTEGER DEFAULT 1;

-- updated_at カラムを追加
ALTER TABLE member_sessions ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- インデックスを作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_member_sessions_member_id ON member_sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_member_sessions_expires_at ON member_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_member_sessions_is_active ON member_sessions(is_active);
