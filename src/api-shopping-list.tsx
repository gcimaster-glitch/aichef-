// 買い物リスト・献立印刷送信API
// src/index.tsxに追加するコード

import { generateShoppingList, formatShoppingListForPrint } from './helpers/shopping-list';

// 買い物リスト生成API
app.get('/api/shopping-list/:meal_plan_id', async (c) => {
  try {
    const { env } = c;
    const mealPlanId = c.req.param('meal_plan_id');

    const result = await generateShoppingList(env.DB, mealPlanId);

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error
      }, 404);
    }

    return c.json({
      success: true,
      shopping_list: result.shopping_list
    });

  } catch (error: any) {
    console.error('買い物リスト取得エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});

// 買い物リスト印刷用HTML取得API
app.get('/api/shopping-list/:meal_plan_id/print', async (c) => {
  try {
    const { env } = c;
    const mealPlanId = c.req.param('meal_plan_id');

    const result = await generateShoppingList(env.DB, mealPlanId);

    if (!result.success) {
      return c.html('<h1>エラー</h1><p>買い物リストが見つかりません</p>', 404);
    }

    const html = formatShoppingListForPrint(result.shopping_list);
    return c.html(html);

  } catch (error: any) {
    console.error('買い物リスト印刷エラー:', error);
    return c.html(`<h1>エラー</h1><p>${error.message || 'システムエラーが発生しました'}</p>`, 500);
  }
});

// 買い物リストメール送信API（RESEND API使用）
app.post('/api/shopping-list/:meal_plan_id/send', async (c) => {
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

    // 買い物リスト生成
    const result = await generateShoppingList(env.DB, mealPlanId);

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error
      }, 404);
    }

    // メール本文作成
    let emailBody = '■ 買い物リスト\n\n';
    emailBody += `作成日: ${new Date().toLocaleDateString('ja-JP')}\n`;
    emailBody += `合計: ${result.shopping_list.total_items}品目\n\n`;

    result.shopping_list.categories.forEach((category: any) => {
      emailBody += `【${category.category_name}】\n`;
      category.items.forEach((item: any) => {
        emailBody += `□ ${item.name} ${item.total_quantity}${item.unit}\n`;
      });
      emailBody += '\n';
    });

    emailBody += '\n---\nAICHEFS - 毎日の献立を考える負担から解放\nhttps://aichefs.net/';

    // RESEND APIでメール送信（環境変数RESEND_API_KEYが必要）
    const resendApiKey = env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      // RESEND APIキーがない場合はスキップ（開発環境）
      console.log('RESEND_API_KEY not configured. Email skipped.');
      return c.json({
        success: true,
        message: '買い物リストを生成しました（メール送信は開発環境のためスキップ）',
        shopping_list: result.shopping_list
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
        subject: '【AICHEFS】買い物リスト',
        text: emailBody
      })
    });

    if (!resendResponse.ok) {
      throw new Error('メール送信に失敗しました');
    }

    return c.json({
      success: true,
      message: `買い物リストを ${email} に送信しました`,
      shopping_list: result.shopping_list
    });

  } catch (error: any) {
    console.error('買い物リスト送信エラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});
