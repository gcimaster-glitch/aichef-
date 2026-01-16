// ワンクリック一ヶ月献立生成API
// src/index.tsxに追加するコード

import { generateMonthlyMealPlan } from './helpers/monthly-meal-plan';
import { checkUsageLimit, incrementUsageCount } from './helpers/usage-limit';

// ワンクリック一ヶ月献立生成API
app.post('/api/meal-plans/generate-monthly', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    const { member_id } = body;

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

    // 一ヶ月献立生成
    const result = await generateMonthlyMealPlan(env.DB, member_id);

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error
      }, 500);
    }

    // 利用回数を増加
    await incrementUsageCount(env.DB, member_id);

    // 更新された利用回数を取得
    const updatedLimit = await checkUsageLimit(env.DB, member_id);

    return c.json({
      success: true,
      meal_plan: {
        meal_plan_id: result.meal_plan_id,
        days: result.days,
        recipes_count: result.recipes?.length || 0
      },
      usage: {
        current_count: updatedLimit.current_count,
        max_count: updatedLimit.max_count,
        remaining: (updatedLimit.max_count || 0) - (updatedLimit.current_count || 0)
      },
      message: '30日分の献立を生成しました！'
    });

  } catch (error: any) {
    console.error('一ヶ月献立生成エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});

// 献立詳細取得API
app.get('/api/meal-plans/:meal_plan_id', async (c) => {
  try {
    const { env } = c;
    const mealPlanId = c.req.param('meal_plan_id');

    // 献立基本情報取得
    const mealPlan = await env.DB.prepare(`
      SELECT 
        meal_plan_id, household_id, plan_name, start_date, days, created_at
      FROM meal_plans
      WHERE meal_plan_id = ?
    `).bind(mealPlanId).first();

    if (!mealPlan) {
      return c.json({
        success: false,
        error: '献立が見つかりません'
      }, 404);
    }

    // 各日の献立取得
    const days = await env.DB.prepare(`
      SELECT 
        mpd.meal_plan_day_id,
        mpd.day_number,
        mpd.plan_date,
        mpdr.recipe_id,
        mpdr.meal_type,
        r.title,
        r.role,
        r.time_min
      FROM meal_plan_days mpd
      LEFT JOIN meal_plan_day_recipes mpdr ON mpd.meal_plan_day_id = mpdr.meal_plan_day_id
      LEFT JOIN recipes r ON mpdr.recipe_id = r.recipe_id
      WHERE mpd.meal_plan_id = ?
      ORDER BY mpd.day_number, mpdr.meal_type
    `).bind(mealPlanId).all();

    // 日付ごとにグループ化
    const groupedDays: any = {};
    days.results?.forEach((row: any) => {
      const dayNum = row.day_number;
      if (!groupedDays[dayNum]) {
        groupedDays[dayNum] = {
          day_number: dayNum,
          plan_date: row.plan_date,
          main: null,
          side: null,
          soup: null
        };
      }

      if (row.recipe_id) {
        const recipeData = {
          recipe_id: row.recipe_id,
          title: row.title,
          role: row.role,
          time_min: row.time_min
        };

        if (row.meal_type === 'main') groupedDays[dayNum].main = recipeData;
        else if (row.meal_type === 'side') groupedDays[dayNum].side = recipeData;
        else if (row.meal_type === 'soup') groupedDays[dayNum].soup = recipeData;
      }
    });

    const daysList = Object.values(groupedDays);

    return c.json({
      success: true,
      meal_plan: mealPlan,
      days: daysList
    });

  } catch (error: any) {
    console.error('献立詳細取得エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});
