-- デモ用ユーザーアカウント
INSERT OR REPLACE INTO households (household_id, email, password_hash, name, created_at)
VALUES 
  ('demo-user-001', 'demo@aichef.net', '$2a$10$rX8H4xQ7vK9mN2pL6wE5YOqZ3tJ1hC8bV4sF7mR9nP2qL5wE8xQ6K', 'デモユーザー', datetime('now')),
  ('demo-admin-001', 'admin@aichef.net', '$2a$10$aB3cD4eF5gH6iJ7kL8mN9oPqR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0k', '管理者アカウント', datetime('now'));

-- デモユーザーのテスト献立データ
INSERT OR REPLACE INTO plans (plan_id, household_id, title, start_date, days, created_at)
VALUES ('demo-plan-001', 'demo-user-001', 'デモ用1週間献立', '2026-01-06', 7, datetime('now'));

