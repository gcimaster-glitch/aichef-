// 利用回数制限チェックAPI
// src/index.tsxに追加するコード

import { checkUsageLimit, incrementUsageCount } from './helpers/usage-limit';

// 利用回数制限チェックAPI
app.get('/api/usage/check/:member_id', async (c) => {
  try {
    const { env } = c;
    const memberId = c.req.param('member_id');

    const result = await checkUsageLimit(env.DB, memberId);

    return c.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    console.error('利用回数チェックエラー:', error);
    return c.json({
      success: false,
      allowed: false,
      reason: 'システムエラーが発生しました'
    }, 500);
  }
});

// 献立生成API（利用回数制限付き）
// 既存の /api/meal-plans/generate を拡張
app.post('/api/meal-plans/generate-with-limit', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    const { member_id, household_id, days = 7, preferences = {} } = body;

    // 必須パラメータチェック
    if (!member_id) {
      return c.json({
        success: false,
        error: '会員IDが必要です'
      }, 400);
    }

    // 利用回数制限チェック
    const limitCheck = await checkUsageLimit(env.DB, member_id);

    if (!limitCheck.allowed) {
      return c.json({
        success: false,
        error: limitCheck.reason,
        current_count: limitCheck.current_count,
        max_count: limitCheck.max_count,
        member_type: limitCheck.member_type,
        requires_upgrade: limitCheck.member_type === 'free'
      }, 403);
    }

    // 献立生成処理（既存のロジックを呼び出し）
    // ここでは簡易版の実装例
    const mealPlanId = `mp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // 献立生成のダミーデータ（実際は既存のAI生成ロジックを使用）
    const mealPlan = {
      meal_plan_id: mealPlanId,
      household_id: household_id || member_id,
      plan_name: `${days}日分の献立`,
      start_date: new Date().toISOString().split('T')[0],
      days: days,
      created_at: new Date().toISOString()
    };

    // 献立をデータベースに保存（無料会員は保存しない）
    if (limitCheck.member_type === 'paid') {
      await env.DB.prepare(`
        INSERT INTO meal_plans (
          meal_plan_id, household_id, plan_name, start_date, days, created_at
        ) VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        mealPlan.meal_plan_id,
        mealPlan.household_id,
        mealPlan.plan_name,
        mealPlan.start_date,
        mealPlan.days
      ).run();
    }

    // 利用回数を増加
    await incrementUsageCount(env.DB, member_id);

    // 更新された利用回数を取得
    const updatedLimit = await checkUsageLimit(env.DB, member_id);

    return c.json({
      success: true,
      meal_plan: mealPlan,
      usage: {
        current_count: updatedLimit.current_count,
        max_count: updatedLimit.max_count,
        remaining: (updatedLimit.max_count || 0) - (updatedLimit.current_count || 0)
      },
      saved: limitCheck.member_type === 'paid' // 有料会員のみ保存
    });

  } catch (error: any) {
    console.error('献立生成エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});
