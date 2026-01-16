// 利用回数制限ヘルパー関数
// src/helpers/usage-limit.ts

export interface UsageLimitResult {
  allowed: boolean;
  reason?: string;
  current_count?: number;
  max_count?: number;
  member_type?: string;
}

/**
 * 会員の献立生成回数制限をチェック
 * @param db - D1 Database
 * @param memberId - 会員ID
 * @returns 生成可能かどうかの結果
 */
export async function checkUsageLimit(db: D1Database, memberId: string): Promise<UsageLimitResult> {
  try {
    // 会員情報取得
    const member = await db.prepare(`
      SELECT 
        member_id,
        member_type,
        membership_expires_at,
        monthly_generation_count,
        last_generation_month
      FROM members
      WHERE member_id = ?
    `).bind(memberId).first();

    if (!member) {
      return {
        allowed: false,
        reason: '会員情報が見つかりません'
      };
    }

    const memberType = member.member_type || 'free';
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    const lastMonth = member.last_generation_month;
    let currentCount = member.monthly_generation_count || 0;

    // 月が変わった場合はカウントリセット
    if (lastMonth !== currentMonth) {
      currentCount = 0;
    }

    // 無料会員のチェック（1回のみ）
    if (memberType === 'free') {
      if (currentCount >= 1) {
        return {
          allowed: false,
          reason: '無料会員は1回のみご利用いただけます。2回目以降は年間500円からの寄付が必要です。',
          current_count: currentCount,
          max_count: 1,
          member_type: 'free'
        };
      }
      return {
        allowed: true,
        current_count: currentCount,
        max_count: 1,
        member_type: 'free'
      };
    }

    // 有料会員のチェック
    if (memberType === 'paid') {
      // 有効期限チェック
      const expiresAt = member.membership_expires_at;
      if (expiresAt && new Date(expiresAt) < new Date()) {
        return {
          allowed: false,
          reason: '会員期限が切れています。寄付を更新してください。',
          member_type: 'paid'
        };
      }

      // 月5回制限チェック
      if (currentCount >= 5) {
        return {
          allowed: false,
          reason: `今月の献立生成回数が上限（5回）に達しました。来月またご利用ください。`,
          current_count: currentCount,
          max_count: 5,
          member_type: 'paid'
        };
      }

      return {
        allowed: true,
        current_count: currentCount,
        max_count: 5,
        member_type: 'paid'
      };
    }

    // その他の場合（デフォルト: 無料扱い）
    return {
      allowed: false,
      reason: '会員タイプが不明です'
    };

  } catch (error: any) {
    console.error('利用回数制限チェックエラー:', error);
    return {
      allowed: false,
      reason: 'システムエラーが発生しました'
    };
  }
}

/**
 * 献立生成回数を増加
 * @param db - D1 Database
 * @param memberId - 会員ID
 */
export async function incrementUsageCount(db: D1Database, memberId: string): Promise<void> {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

  await db.prepare(`
    UPDATE members
    SET 
      monthly_generation_count = CASE
        WHEN last_generation_month = ? THEN monthly_generation_count + 1
        ELSE 1
      END,
      last_generation_month = ?,
      updated_at = datetime('now')
    WHERE member_id = ?
  `).bind(currentMonth, currentMonth, memberId).run();
}

/**
 * 無料ユーザーの献立データを削除（保存しない）
 * @param db - D1 Database
 * @param mealPlanId - 献立ID
 */
export async function deleteFreeUserMealPlan(db: D1Database, mealPlanId: string): Promise<void> {
  // meal_plan_day_recipesから削除
  await db.prepare(`
    DELETE FROM meal_plan_day_recipes
    WHERE meal_plan_day_id IN (
      SELECT mpd.meal_plan_day_id
      FROM meal_plan_days mpd
      WHERE mpd.meal_plan_id = ?
    )
  `).bind(mealPlanId).run();

  // meal_plan_daysから削除
  await db.prepare(`
    DELETE FROM meal_plan_days
    WHERE meal_plan_id = ?
  `).bind(mealPlanId).run();

  // meal_plansから削除
  await db.prepare(`
    DELETE FROM meal_plans
    WHERE meal_plan_id = ?
  `).bind(mealPlanId).run();
}
