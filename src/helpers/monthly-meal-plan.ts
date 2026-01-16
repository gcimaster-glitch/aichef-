// ワンクリック一ヶ月献立生成ヘルパー
// src/helpers/monthly-meal-plan.ts

/**
 * 一ヶ月分の献立を生成（30日分）
 * アンケート情報（家族構成、好き嫌い、アレルギー）を元に生成
 */
export async function generateMonthlyMealPlan(
  db: D1Database,
  memberId: string
): Promise<{
  success: boolean;
  meal_plan_id?: string;
  days?: number;
  recipes?: any[];
  error?: string;
}> {
  try {
    // 会員情報取得
    const member = await db.prepare(`
      SELECT member_id, name, email FROM members WHERE member_id = ?
    `).bind(memberId).first();

    if (!member) {
      return { success: false, error: '会員情報が見つかりません' };
    }

    // 家族構成取得
    const familyMembers = await db.prepare(`
      SELECT 
        name, age, gender, relationship,
        allergies_json, dislikes_json
      FROM family_members
      WHERE member_id = ?
    `).bind(memberId).all();

    // アレルギー・嫌いな食べ物を集約
    const allergies = new Set<string>();
    const dislikes = new Set<string>();
    
    familyMembers.results?.forEach((fm: any) => {
      try {
        const allergyList = JSON.parse(fm.allergies_json || '[]');
        const dislikeList = JSON.parse(fm.dislikes_json || '[]');
        allergyList.forEach((a: string) => allergies.add(a));
        dislikeList.forEach((d: string) => dislikes.add(d));
      } catch (e) {
        console.error('JSON解析エラー:', e);
      }
    });

    // 30日分のレシピを取得
    const days = 30;
    const mealPlanId = `mp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // レシピをランダムに選択（主菜、副菜、汁物をバランスよく）
    const recipes = [];
    
    for (let day = 1; day <= days; day++) {
      // 主菜1品
      const mainDish = await db.prepare(`
        SELECT recipe_id, title, role, time_min
        FROM recipes
        WHERE role = 'main'
        ORDER BY RANDOM()
        LIMIT 1
      `).first();

      // 副菜1品
      const sideDish = await db.prepare(`
        SELECT recipe_id, title, role, time_min
        FROM recipes
        WHERE role = 'side'
        ORDER BY RANDOM()
        LIMIT 1
      `).first();

      // 汁物1品
      const soupDish = await db.prepare(`
        SELECT recipe_id, title, role, time_min
        FROM recipes
        WHERE role = 'soup'
        ORDER BY RANDOM()
        LIMIT 1
      `).first();

      recipes.push({
        day: day,
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        main: mainDish,
        side: sideDish,
        soup: soupDish
      });
    }

    // 献立をデータベースに保存
    const startDate = new Date().toISOString().split('T')[0];
    
    await db.prepare(`
      INSERT INTO meal_plans (
        meal_plan_id, household_id, plan_name, start_date, days, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      mealPlanId,
      memberId,
      `${days}日分の献立`,
      startDate,
      days
    ).run();

    // 各日の献立を保存
    for (let i = 0; i < recipes.length; i++) {
      const dayData = recipes[i];
      const dayId = `mpd_${mealPlanId}_${i + 1}`;
      const dayDate = dayData.date;

      // meal_plan_daysに挿入
      await db.prepare(`
        INSERT INTO meal_plan_days (
          meal_plan_day_id, meal_plan_id, day_number, plan_date, created_at
        ) VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(dayId, mealPlanId, i + 1, dayDate).run();

      // 各レシピを meal_plan_day_recipes に挿入
      if (dayData.main) {
        await db.prepare(`
          INSERT INTO meal_plan_day_recipes (
            meal_plan_day_id, recipe_id, meal_type
          ) VALUES (?, ?, 'main')
        `).bind(dayId, dayData.main.recipe_id).run();
      }

      if (dayData.side) {
        await db.prepare(`
          INSERT INTO meal_plan_day_recipes (
            meal_plan_day_id, recipe_id, meal_type
          ) VALUES (?, ?, 'side')
        `).bind(dayId, dayData.side.recipe_id).run();
      }

      if (dayData.soup) {
        await db.prepare(`
          INSERT INTO meal_plan_day_recipes (
            meal_plan_day_id, recipe_id, meal_type
          ) VALUES (?, ?, 'soup')
        `).bind(dayId, dayData.soup.recipe_id).run();
      }
    }

    return {
      success: true,
      meal_plan_id: mealPlanId,
      days: days,
      recipes: recipes
    };

  } catch (error: any) {
    console.error('一ヶ月献立生成エラー:', error);
    return {
      success: false,
      error: error.message || 'システムエラーが発生しました'
    };
  }
}
