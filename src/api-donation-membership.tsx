// 寄付統合API
// src/index.tsxに追加するコード

import { processMembershipDonation, generateDonorNickname } from './helpers/donation-helper';

// 会員寄付API（寄付名機能付き）
app.post('/api/donations/membership', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();
    
    const {
      donor_name,
      donor_display_name, // 寄付名（任意、空の場合は自動生成）
      donor_email,
      donor_phone,
      amount,
      unit_count,
      message,
      is_public = 1,
      member_id // 既存会員の場合
    } = body;

    // バリデーション
    if (!donor_name || !donor_email || !amount || !unit_count) {
      return c.json({
        success: false,
        error: '必須項目が不足しています（氏名、メール、寄付額、口数）'
      }, 400);
    }

    // 金額チェック（500円〜50,000円、1口500円）
    if (amount < 500 || amount > 50000 || amount % 500 !== 0) {
      return c.json({
        success: false,
        error: '寄付額は500円〜50,000円の範囲で、500円単位で指定してください'
      }, 400);
    }

    // 口数チェック（1〜100口）
    if (unit_count < 1 || unit_count > 100 || unit_count !== amount / 500) {
      return c.json({
        success: false,
        error: '口数が不正です（1口500円、1〜100口まで）'
      }, 400);
    }

    // 寄付処理実行
    const result = await processMembershipDonation(env.DB, {
      donor_name,
      donor_display_name,
      donor_email,
      donor_phone,
      amount,
      unit_count,
      message,
      is_public
    }, member_id);

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error
      }, 500);
    }

    // 寄付名が自動生成されたかチェック
    const finalDisplayName = donor_display_name && donor_display_name.trim() !== ''
      ? donor_display_name
      : generateDonorNickname();

    return c.json({
      success: true,
      donation_id: result.donation_id,
      member_id: result.member_id,
      membership_expires_at: result.expires_at,
      donor_display_name: finalDisplayName,
      message: '寄付ありがとうございます！会員登録が完了しました。'
    });

  } catch (error: any) {
    console.error('会員寄付APIエラー:', error);
    return c.json({
      success: false,
      error: error.message || 'システムエラーが発生しました'
    }, 500);
  }
});

// 寄付名自動生成プレビューAPI
app.get('/api/donations/nickname-preview', async (c) => {
  try {
    // 3つのニックネーム候補を生成
    const nicknames = [
      generateDonorNickname(),
      generateDonorNickname(),
      generateDonorNickname()
    ];

    return c.json({
      success: true,
      nicknames: nicknames,
      message: '寄付名を入力しない場合、いずれかが自動的に割り当てられます'
    });

  } catch (error: any) {
    console.error('ニックネームプレビューエラー:', error);
    return c.json({
      success: false,
      error: 'システムエラーが発生しました'
    }, 500);
  }
});
