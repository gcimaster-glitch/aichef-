// 献立印刷送信API
// src/index.tsxに追加するコード

import { formatMealPlanForPrint, formatMealPlanForEmail } from './helpers/meal-plan-print';

// 献立印刷用HTML取得API
app.get('/api/meal-plans/:meal_plan_id/print', async (c) => {
  try {
    const { env } = c;
    const mealPlanId = c.req.param('meal_plan_id');

    // 献立基本情報取得
    const mealPlan = await env.DB.prepare(`
      SELECT meal_plan_id, plan_name, start_date, days FROM meal_plans WHERE meal_plan_id = ?
    `).bind(mealPlanId).first();

    if (!mealPlan) {
      return c.html('<h1>エラー</h1><p>献立が見つかりません</p>', 404);
    }

    // 各日の献立取得
    const daysData = await env.DB.prepare(`
      SELECT 
        mpd.meal_plan_day_id, mpd.day_number, mpd.plan_date,
        mpdr.recipe_id, mpdr.meal_type,
        r.title, r.role, r.time_min
      FROM meal_plan_days mpd
      LEFT JOIN meal_plan_day_recipes mpdr ON mpd.meal_plan_day_id = mpdr.meal_plan_day_id
      LEFT JOIN recipes r ON mpdr.recipe_id = r.recipe_id
      WHERE mpd.meal_plan_id = ?
      ORDER BY mpd.day_number, mpdr.meal_type
    `).bind(mealPlanId).all();

    // 日付ごとにグループ化
    const groupedDays: any = {};
    daysData.results?.forEach((row: any) => {
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
    const html = formatMealPlanForPrint(mealPlan, daysList);
    
    return c.html(html);

  } catch (error: any) {
    console.error('献立印刷エラー:', error);
    return c.html(`<h1>エラー</h1><p>${error.message || 'システムエラーが発生しました'}</p>`, 500);
  }
});

// 献立メール送信API
app.post('/api/meal-plans/:meal_plan_id/send', async (c) => {
  try {
    const { env } = c;
    const mealPlanId = c.req.param('meal_plan_id');
    const body = await c.req.json();
    const { email, member_id } = body;

    if (!email) {
      return c.json({
        success: false,
        error: 'メールアドレスが必要です'
      }, 400);
    }

    // 献立取得
    const mealPlan = await env.DB.prepare(`
      SELECT meal_plan_id, plan_name, start_date, days FROM meal_plans WHERE meal_plan_id = ?
    `).bind(mealPlanId).first();

    if (!mealPlan) {
      return c.json({
        success: false,
        error: '献立が見つかりません'
      }, 404);
    }

    // 各日の献立取得
    const daysData = await env.DB.prepare(`
      SELECT 
        mpd.meal_plan_day_id, mpd.day_number, mpd.plan_date,
        mpdr.recipe_id, mpdr.meal_type,
        r.title, r.role, r.time_min
      FROM meal_plan_days mpd
      LEFT JOIN meal_plan_day_recipes mpdr ON mpd.meal_plan_day_id = mpdr.meal_plan_day_id
      LEFT JOIN recipes r ON mpdr.recipe_id = r.recipe_id
      WHERE mpd.meal_plan_id = ?
      ORDER BY mpd.day_number, mpdr.meal_type
    `).bind(mealPlanId).all();

    // 日付ごとにグループ化
    const groupedDays: any = {};
    daysData.results?.forEach((row: any) => {
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
    const emailBody = formatMealPlanForEmail(mealPlan, daysList);

    // RESEND APIでメール送信
    const resendApiKey = env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured. Email skipped.');
      return c.json({
        success: true,
        message: '献立を取得しました（メール送信は開発環境のためスキップ）',
        meal_plan: mealPlan
      });
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AICHEFS <noreply@aichefs.net>',
        to: [email],
        subject: `【AICHEFS】献立表 - ${mealPlan.plan_name}`,
        text: emailBody
      })
    });

    if (!resendResponse.ok) {
      throw new Error('メール送信に失敗しました');
    }

    return c.json({
      success: true,
      message: `献立を ${email} に送信しました`,
      meal_plan: mealPlan
    });

  } catch (error: any) {
    console.error('献立送信エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});
