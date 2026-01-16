// メールリマインダーヘルパー
// src/helpers/email-reminder.ts

/**
 * リマインダー設定を取得・作成
 */
export async function getOrCreateReminder(
  db: D1Database,
  memberId: string,
  frequency: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<any> {
  // 既存のリマインダー設定取得
  let reminder = await db.prepare(`
    SELECT * FROM email_reminders WHERE member_id = ?
  `).bind(memberId).first();

  // なければ作成
  if (!reminder) {
    await db.prepare(`
      INSERT INTO email_reminders (
        member_id, frequency, enabled, created_at
      ) VALUES (?, ?, 1, datetime('now'))
    `).bind(memberId, frequency).run();

    reminder = await db.prepare(`
      SELECT * FROM email_reminders WHERE member_id = ?
    `).bind(memberId).first();
  }

  return reminder;
}

/**
 * リマインダー設定を更新
 */
export async function updateReminderSettings(
  db: D1Database,
  memberId: string,
  settings: {
    frequency?: 'daily' | 'weekly' | 'monthly';
    enabled?: boolean;
  }
): Promise<boolean> {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (settings.frequency !== undefined) {
      updates.push('frequency = ?');
      values.push(settings.frequency);
    }

    if (settings.enabled !== undefined) {
      updates.push('enabled = ?');
      values.push(settings.enabled ? 1 : 0);
    }

    updates.push('updated_at = datetime(\'now\')');
    values.push(memberId);

    await db.prepare(`
      UPDATE email_reminders
      SET ${updates.join(', ')}
      WHERE member_id = ?
    `).bind(...values).run();

    return true;
  } catch (error) {
    console.error('リマインダー設定更新エラー:', error);
    return false;
  }
}

/**
 * リマインダー送信が必要な会員を取得
 */
export async function getMembersForReminder(
  db: D1Database,
  frequency: 'daily' | 'weekly' | 'monthly'
): Promise<any[]> {
  const now = new Date();
  let timeCondition = '';

  if (frequency === 'daily') {
    // 24時間以上前
    timeCondition = "datetime(last_sent_at, '+1 day') <= datetime('now')";
  } else if (frequency === 'weekly') {
    // 7日以上前
    timeCondition = "datetime(last_sent_at, '+7 days') <= datetime('now')";
  } else if (frequency === 'monthly') {
    // 30日以上前
    timeCondition = "datetime(last_sent_at, '+30 days') <= datetime('now')";
  }

  const members = await db.prepare(`
    SELECT 
      er.member_id,
      m.email,
      m.name,
      er.frequency,
      er.last_sent_at
    FROM email_reminders er
    JOIN members m ON er.member_id = m.member_id
    WHERE er.enabled = 1
      AND er.frequency = ?
      AND (er.last_sent_at IS NULL OR ${timeCondition})
  `).bind(frequency).all();

  return members.results || [];
}

/**
 * リマインダー送信記録を更新
 */
export async function markReminderSent(
  db: D1Database,
  memberId: string
): Promise<void> {
  await db.prepare(`
    UPDATE email_reminders
    SET 
      last_sent_at = datetime('now'),
      updated_at = datetime('now')
    WHERE member_id = ?
  `).bind(memberId).run();
}

/**
 * リマインダーメール本文を生成
 */
export function generateReminderEmailBody(
  memberName: string,
  frequency: string
): string {
  const frequencyName = {
    'daily': '毎日',
    'weekly': '週1回',
    'monthly': '月1回'
  }[frequency] || frequency;

  return `
${memberName} 様

いつもAICHEFSをご利用いただきありがとうございます。

献立作成のリマインダーです。
今週の献立はもう決まりましたか？

【ワンクリックで一ヶ月分の献立を作成】
https://aichefs.net/dashboard

【今すぐ献立を作成する】
https://aichefs.net/meal-plans/generate

━━━━━━━━━━━━━━━━
リマインダー設定: ${frequencyName}
設定を変更: https://aichefs.net/settings/reminders
━━━━━━━━━━━━━━━━

AICHEFS - 毎日の献立を考える負担から解放
https://aichefs.net/

このメールは自動送信されています。
配信停止はこちら: https://aichefs.net/settings/reminders
`;
}
