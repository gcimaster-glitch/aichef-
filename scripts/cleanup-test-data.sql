-- =====================================================
-- テストデータ完全削除スクリプト
-- =====================================================
-- 作成日: 2026-01-19
-- 目的: 本番運用前のテストデータクリーンアップ
-- 対象: households関連の全データ（972件）
-- =====================================================

-- 外部キー制約を考慮して、子テーブルから順に削除

-- 1. 献立レシピ紐付け（447件）
DELETE FROM meal_plan_day_recipes;

-- 2. 献立日次データ（150件）
DELETE FROM meal_plan_days;

-- 3. 献立プラン（5件）
DELETE FROM meal_plans;

-- 4. 家族メンバー（289件）
DELETE FROM household_members;

-- 5. セッションデータ（0件）
DELETE FROM member_sessions WHERE member_id IN (SELECT household_id FROM households);

-- 6. 世帯データ（81件）
DELETE FROM households;

-- 7. favorite_recipes（お気に入りレシピ）
DELETE FROM favorite_recipes;

-- 8. household_dislikes（世帯の嫌いな食材）
DELETE FROM household_dislikes;

-- 9. plan_history（献立履歴）
DELETE FROM plan_history;

-- 10. plan_feedbacks（献立フィードバック）
DELETE FROM plan_feedbacks;

-- 確認用クエリ（削除後の件数確認）
SELECT 
  (SELECT COUNT(*) FROM households) as households_remaining,
  (SELECT COUNT(*) FROM meal_plans) as meal_plans_remaining,
  (SELECT COUNT(*) FROM meal_plan_days) as meal_plan_days_remaining,
  (SELECT COUNT(*) FROM meal_plan_day_recipes) as meal_plan_day_recipes_remaining,
  (SELECT COUNT(*) FROM household_members) as household_members_remaining,
  (SELECT COUNT(*) FROM member_sessions) as member_sessions_remaining,
  (SELECT COUNT(*) FROM recipes) as recipes_count,
  (SELECT COUNT(*) FROM ingredients) as ingredients_count;
