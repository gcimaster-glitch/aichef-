// 寄付統合ヘルパー関数
// src/helpers/donation-helper.ts

/**
 * 自動ニックネーム生成
 * ユーザーが寄付名を入力しない場合に使用
 */
export function generateDonorNickname(): string {
  const prefixes = [
    '優しい支援者',
    '温かい心',
    '思いやりの',
    '希望の光',
    '笑顔の',
    '愛情深い',
    '心優しい',
    '未来を創る',
    '子供を守る',
    '夢を支える'
  ];

  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999

  return `${randomPrefix}${randomNumber}`;
}

/**
 * 寄付処理と会員登録の統合
 * @param db - D1 Database
 * @param donationData - 寄付データ
 * @param memberId - 会員ID（既存会員の場合）
 */
export async function processMembershipDonation(
  db: D1Database,
  donationData: {
    donor_name: string;
    donor_display_name?: string;
    donor_email: string;
    donor_phone?: string;
    amount: number;
    unit_count: number;
    message?: string;
    is_public?: number;
  },
  memberId?: string
): Promise<{
  success: boolean;
  donation_id?: string;
  member_id?: string;
  expires_at?: string;
  error?: string;
}> {
  try {
    // 寄付名が空の場合は自動生成
    const displayName = donationData.donor_display_name && donationData.donor_display_name.trim() !== ''
      ? donationData.donor_display_name
      : generateDonorNickname();

    // 寄付IDを生成
    const donationId = `don_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // 寄付情報を保存
    await db.prepare(`
      INSERT INTO donations (
        donation_id,
        household_id,
        member_id,
        donor_name,
        donor_display_name,
        donor_email,
        donor_phone,
        amount,
        unit_count,
        message,
        donation_type,
        status,
        is_public,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'membership', 'completed', ?, datetime('now'))
    `).bind(
      donationId,
      memberId || null,
      memberId || null,
      donationData.donor_name,
      displayName,
      donationData.donor_email,
      donationData.donor_phone || null,
      donationData.amount,
      donationData.unit_count,
      donationData.message || null,
      donationData.is_public !== undefined ? donationData.is_public : 1
    ).run();

    // 会員情報を更新（既存会員の場合）または新規作成
    let finalMemberId = memberId;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1年後
    const expiresAtStr = expiresAt.toISOString();

    if (memberId) {
      // 既存会員の場合：有料会員に更新、有効期限を延長
      await db.prepare(`
        UPDATE members
        SET 
          member_type = 'paid',
          membership_expires_at = ?,
          phone = COALESCE(?, phone),
          updated_at = datetime('now')
        WHERE member_id = ?
      `).bind(expiresAtStr, donationData.donor_phone || null, memberId).run();
    } else {
      // 新規会員の場合：会員レコード作成（パスワードは仮）
      finalMemberId = `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      await db.prepare(`
        INSERT INTO members (
          member_id,
          email,
          password_hash,
          name,
          full_name,
          phone,
          member_type,
          membership_expires_at,
          status,
          created_at
        ) VALUES (?, ?, '', ?, ?, ?, 'paid', ?, 'active', datetime('now'))
      `).bind(
        finalMemberId,
        donationData.donor_email,
        donationData.donor_name,
        donationData.donor_name,
        donationData.donor_phone || null,
        expiresAtStr
      ).run();

      // 寄付レコードにmember_idを更新
      await db.prepare(`
        UPDATE donations
        SET member_id = ?, household_id = ?
        WHERE donation_id = ?
      `).bind(finalMemberId, finalMemberId, donationId).run();
    }

    return {
      success: true,
      donation_id: donationId,
      member_id: finalMemberId,
      expires_at: expiresAtStr
    };

  } catch (error: any) {
    console.error('寄付処理エラー:', error);
    return {
      success: false,
      error: error.message || 'システムエラーが発生しました'
    };
  }
}
