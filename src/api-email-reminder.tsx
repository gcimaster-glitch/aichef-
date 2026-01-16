// メールリマインダーAPI
// src/index.tsxに追加するコード

import { 
  getOrCreateReminder, 
  updateReminderSettings, 
  getMembersForReminder,
  markReminderSent,
  generateReminderEmailBody
} from './helpers/email-reminder';

// リマインダー設定取得API
app.get('/api/reminders/:member_id', async (c) => {
  try {
    const { env } = c;
    const memberId = c.req.param('member_id');

    const reminder = await getOrCreateReminder(env.DB, memberId);

    return c.json({
      success: true,
      reminder: reminder
    });

  } catch (error: any) {
    console.error('リマインダー取得エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});

// リマインダー設定更新API
app.put('/api/reminders/:member_id', async (c) => {
  try {
    const { env } = c;
    const memberId = c.req.param('member_id');
    const body = await c.req.json();
    const { frequency, enabled } = body;

    // バリデーション
    if (frequency && !['daily', 'weekly', 'monthly'].includes(frequency)) {
      return c.json({
        success: false,
        error: '頻度は daily, weekly, monthly のいずれかを指定してください'
      }, 400);
    }

    const result = await updateReminderSettings(env.DB, memberId, {
      frequency,
      enabled
    });

    if (!result) {
      return c.json({
        success: false,
        error: '設定の更新に失敗しました'
      }, 500);
    }

    const updatedReminder = await getOrCreateReminder(env.DB, memberId);

    return c.json({
      success: true,
      reminder: updatedReminder,
      message: 'リマインダー設定を更新しました'
    });

  } catch (error: any) {
    console.error('リマインダー更新エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});

// リマインダー一括送信API（管理者専用・Cron用）
app.post('/api/reminders/send-batch', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    const { frequency = 'weekly', admin_key } = body;

    // 簡易的な管理者認証（本番環境では適切な認証を実装）
    const expectedAdminKey = env.ADMIN_KEY || 'your-secure-admin-key';
    if (admin_key !== expectedAdminKey) {
      return c.json({
        success: false,
        error: '認証に失敗しました'
      }, 403);
    }

    // 送信対象の会員を取得
    const members = await getMembersForReminder(env.DB, frequency);

    if (members.length === 0) {
      return c.json({
        success: true,
        sent_count: 0,
        message: '送信対象の会員がいません'
      });
    }

    // RESEND APIキーチェック
    const resendApiKey = env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured. Email sending skipped.');
      return c.json({
        success: true,
        sent_count: 0,
        message: 'RESEND_API_KEYが設定されていません（開発環境）'
      });
    }

    // 各会員にメール送信
    let sentCount = 0;
    let failedCount = 0;

    for (const member of members) {
      try {
        const emailBody = generateReminderEmailBody(member.name, frequency);

        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'AICHEFS <noreply@aichefs.net>',
            to: [member.email],
            subject: '【AICHEFS】献立作成のリマインダー',
            text: emailBody
          })
        });

        if (resendResponse.ok) {
          // 送信成功を記録
          await markReminderSent(env.DB, member.member_id);
          sentCount++;
        } else {
          failedCount++;
          console.error(`メール送信失敗: ${member.email}`);
        }

      } catch (error) {
        failedCount++;
        console.error(`メール送信エラー: ${member.email}`, error);
      }
    }

    return c.json({
      success: true,
      sent_count: sentCount,
      failed_count: failedCount,
      total_members: members.length,
      message: `${sentCount}件のリマインダーメールを送信しました`
    });

  } catch (error: any) {
    console.error('リマインダー一括送信エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});

// リマインダーテスト送信API
app.post('/api/reminders/:member_id/test', async (c) => {
  try {
    const { env } = c;
    const memberId = c.req.param('member_id');

    // 会員情報取得
    const member = await env.DB.prepare(`
      SELECT member_id, email, name FROM members WHERE member_id = ?
    `).bind(memberId).first();

    if (!member) {
      return c.json({
        success: false,
        error: '会員情報が見つかりません'
      }, 404);
    }

    // リマインダー設定取得
    const reminder = await getOrCreateReminder(env.DB, memberId);

    // テストメール送信
    const resendApiKey = env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      return c.json({
        success: true,
        message: 'RESEND_API_KEYが設定されていません（開発環境）'
      });
    }

    const emailBody = generateReminderEmailBody(member.name, reminder.frequency);

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AICHEFS <noreply@aichefs.net>',
        to: [member.email],
        subject: '【AICHEFS】リマインダーテスト送信',
        text: emailBody
      })
    });

    if (!resendResponse.ok) {
      throw new Error('メール送信に失敗しました');
    }

    return c.json({
      success: true,
      message: `テストメールを ${member.email} に送信しました`
    });

  } catch (error: any) {
    console.error('リマインダーテスト送信エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});
